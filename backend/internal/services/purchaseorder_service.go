package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PurchaseOrderService struct {
	poRepo        *repository.PurchaseOrderRepository
	supplierRepo  *repository.SupplierRepository
	productRepo   *repository.ProductRepository
	inventoryRepo *repository.InventoryRepository
}

func NewPurchaseOrderService(poRepo *repository.PurchaseOrderRepository, supplierRepo *repository.SupplierRepository, productRepo *repository.ProductRepository, inventoryRepo *repository.InventoryRepository) *PurchaseOrderService {
	return &PurchaseOrderService{poRepo: poRepo, supplierRepo: supplierRepo, productRepo: productRepo, inventoryRepo: inventoryRepo}
}

func (s *PurchaseOrderService) GetAllPurchaseOrders(storeID uint) (*dto.PurchaseOrdersListResponse, error) {
	orders, err := s.poRepo.GetPurchaseOrdersByStore(storeID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách phiếu nhập")
	}

	responses := make([]dto.PurchaseOrderResponse, 0, len(orders))
	for _, o := range orders {
		responses = append(responses, s.toResponse(&o))
	}

	return &dto.PurchaseOrdersListResponse{Orders: responses, Total: len(responses)}, nil
}

func (s *PurchaseOrderService) GetPurchaseOrderByID(storeID, id uint) (*dto.PurchaseOrderResponse, error) {
	order, err := s.poRepo.GetPurchaseOrderByIDAndStore(id, storeID)
	if err != nil {
		return nil, errors.New("Phiếu nhập không tồn tại")
	}
	res := s.toResponse(order)
	return &res, nil
}

func (s *PurchaseOrderService) CreatePurchaseOrder(userID uint, req *dto.PurchaseOrderCreateRequest) (*dto.PurchaseOrderResponse, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("Phiếu nhập phải có ít nhất một sản phẩm")
	}

	if _, err := s.supplierRepo.GetSupplierByIDAndStore(req.SupplierID, req.StoreID); err != nil {
		return nil, errors.New("Nhà cung cấp không tồn tại")
	}

	var createdID uint
	err := s.poRepo.DB.Transaction(func(tx *gorm.DB) error {
		total := 0.0
		po := &models.PurchaseOrder{
			SupplierID: req.SupplierID,
			UserID:     userID,
			StoreID:    req.StoreID,
			Tax:        req.Tax,
			Status:     "completed",
		}

		if err := s.poRepo.CreatePurchaseOrderWithDB(tx, po); err != nil {
			return errors.New("Lỗi khi tạo phiếu nhập")
		}

		items := make([]models.PurchaseOrderItem, 0, len(req.Items))
		for _, it := range req.Items {
			var product models.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("Inventory").First(&product, it.ProductID).Error; err != nil {
				return errors.New("Sản phẩm không tồn tại")
			}
			if product.Inventory == nil {
				return errors.New("Tồn kho sản phẩm không tồn tại")
			}

			subtotal := float64(it.Quantity) * it.ImportPrice
			total += subtotal

			// increase inventory
			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", product.ID).Update("current_stock", gorm.Expr("current_stock + ?", it.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi cập nhật tồn kho")
			}

			// log stock
			log := &models.StockLog{ProductID: product.ID, Type: "purchase_in", Quantity: it.Quantity}
			if err := tx.Create(log).Error; err != nil {
				return errors.New("Lỗi khi ghi nhật ký tồn kho")
			}

			items = append(items, models.PurchaseOrderItem{
				PurchaseOrderID: po.ID,
				ProductID:       product.ID,
				Quantity:        int(it.Quantity),
				ImportPrice:     it.ImportPrice,
				Subtotal:        subtotal,
			})
		}

		po.TotalAmount = total
		if err := s.poRepo.UpdatePurchaseOrderWithDB(tx, po); err != nil {
			return errors.New("Lỗi khi cập nhật phiếu nhập")
		}

		if err := s.poRepo.CreateItemsWithDB(tx, items); err != nil {
			return errors.New("Lỗi khi tạo chi tiết phiếu nhập")
		}

		createdID = po.ID
		return nil
	})

	if err != nil {
		return nil, err
	}

	created, err := s.poRepo.GetPurchaseOrderByIDAndStore(createdID, req.StoreID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy phiếu nhập vừa tạo")
	}
	res := s.toResponse(created)
	return &res, nil
}

func (s *PurchaseOrderService) ReturnPurchaseOrder(userID, storeID, id uint) (*dto.PurchaseOrderResponse, error) {
	var returnedID uint
	err := s.poRepo.DB.Transaction(func(tx *gorm.DB) error {
		var po models.PurchaseOrder
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("Items").First(&po, "id = ? AND store_id = ?", id, storeID).Error; err != nil {
			return errors.New("Phiếu nhập không tồn tại")
		}
		if po.Status != "completed" {
			return errors.New("Chỉ có thể trả phiếu nhập đã hoàn thành")
		}

		// decrease inventory for each item
		for _, item := range po.Items {
			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", item.ProductID).Update("current_stock", gorm.Expr("current_stock - ?", item.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi cập nhật tồn kho")
			}
			log := &models.StockLog{ProductID: item.ProductID, Type: "purchase_return", Quantity: int64(item.Quantity)}
			if err := tx.Create(log).Error; err != nil {
				return errors.New("Lỗi khi ghi nhật ký tồn kho")
			}
		}

		po.Status = "returned"
		if err := s.poRepo.UpdatePurchaseOrderWithDB(tx, &po); err != nil {
			return errors.New("Lỗi khi cập nhật trạng thái phiếu nhập")
		}

		returnedID = po.ID
		return nil
	})

	if err != nil {
		return nil, err
	}

	out, err := s.poRepo.GetPurchaseOrderByIDAndStore(returnedID, storeID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin phiếu nhập")
	}
	res := s.toResponse(out)
	return &res, nil
}

func (s *PurchaseOrderService) toResponse(po *models.PurchaseOrder) dto.PurchaseOrderResponse {
	resp := dto.PurchaseOrderResponse{
		ID:          po.ID,
		SupplierID:  po.SupplierID,
		StoreID:     po.StoreID,
		TotalAmount: po.TotalAmount,
		Tax:         po.Tax,
		Status:      po.Status,
		CreatedAt:   po.CreatedAt,
	}
	if po.Supplier.ID != 0 {
		resp.Supplier = po.Supplier.Name
	}
	items := make([]dto.PurchaseOrderItemResponse, 0, len(po.Items))
	for _, it := range po.Items {
		name := ""
		if it.Product.ID != 0 {
			name = it.Product.Name
		}
		items = append(items, dto.PurchaseOrderItemResponse{ProductID: it.ProductID, ProductName: name, Quantity: int64(it.Quantity), ImportPrice: it.ImportPrice, Subtotal: it.Subtotal})
	}
	resp.Items = items
	return resp
}
