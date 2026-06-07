package services

import (
	"errors"
	"time"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderService struct {
	orderRepo    *repository.OrderRepository
	productRepo  *repository.ProductRepository
	customerRepo *repository.CustomerRepository
}

// NewOrderService creates a new order service.
func NewOrderService(orderRepo *repository.OrderRepository, productRepo *repository.ProductRepository, customerRepo *repository.CustomerRepository) *OrderService {
	return &OrderService{orderRepo: orderRepo, productRepo: productRepo, customerRepo: customerRepo}
}

// GetAllOrders retrieves all orders for the authenticated sales user.
func (s *OrderService) GetAllOrders(userID uint) (*dto.OrdersListResponse, error) {
	orders, err := s.orderRepo.GetOrdersByUserID(userID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách đơn hàng")
	}

	responses := make([]dto.OrderResponse, 0, len(orders))
	for _, order := range orders {
		responses = append(responses, s.toOrderResponse(&order))
	}

	return &dto.OrdersListResponse{Orders: responses, Total: len(responses)}, nil
}

// GetOrderByID retrieves a single order for the authenticated sales user.
func (s *OrderService) GetOrderByID(userID, id uint) (*dto.OrderResponse, error) {
	order, err := s.orderRepo.GetOrderByIDAndUserID(id, userID)
	if err != nil {
		return nil, errors.New("Đơn hàng không tồn tại")
	}

	response := s.toOrderResponse(order)
	return &response, nil
}

// CreateOrder creates a new order, optionally creates a customer, and deducts inventory.
func (s *OrderService) CreateOrder(userID uint, req *dto.OrderCreateRequest) (*dto.OrderResponse, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("Đơn hàng phải có ít nhất một sản phẩm")
	}
	if req.Discount < 0 {
		return nil, errors.New("Giảm giá không hợp lệ")
	}
	if req.Tax < 0 {
		return nil, errors.New("Thuế không hợp lệ")
	}

	items := normalizeOrderItems(req.Items)
	if len(items) == 0 {
		return nil, errors.New("Đơn hàng phải có ít nhất một sản phẩm hợp lệ")
	}

	var createdOrderID uint
	err := s.orderRepo.DB.Transaction(func(tx *gorm.DB) error {
		// --- 1. XỬ LÝ KHÁCH HÀNG ---
		var finalCustomerID *uint

		if req.Customer != nil {
			var existingCustomer models.Customer
			if err := tx.Where("phone = ?", req.Customer.Phone).First(&existingCustomer).Error; err == nil {
				// Use existing customer
				finalCustomerID = &existingCustomer.ID
				// Optionally update name/address/email if provided and different
				updated := false
				if req.Customer.Name != "" && existingCustomer.Name != req.Customer.Name {
					existingCustomer.Name = req.Customer.Name
					updated = true
				}
				if req.Customer.Address != "" && existingCustomer.Address != req.Customer.Address {
					existingCustomer.Address = req.Customer.Address
					updated = true
				}
				if updated {
					if err := tx.Save(&existingCustomer).Error; err != nil {
						return errors.New("Lỗi khi cập nhật thông tin khách hàng")
					}
				}
			} else if errors.Is(err, gorm.ErrRecordNotFound) {
				// Create new customer (generate a code)
				code := "CUST" + time.Now().Format("20060102150405")
				// ensure unique (very unlikely collision)
				// assign fields
				newCustomer := models.Customer{
					Code:    code,
					Name:    req.Customer.Name,
					Phone:   req.Customer.Phone,
					Address: req.Customer.Address,
				}
				if err := s.customerRepo.CreateCustomerWithDB(tx, &newCustomer); err != nil {
					return errors.New("Lỗi khi tạo thông tin khách hàng mới")
				}
				finalCustomerID = &newCustomer.ID
			} else {
				return errors.New("Lỗi khi kiểm tra thông tin khách hàng")
			}

		} else if req.CustomerID != nil {
			var existingCustomer models.Customer
			if err := tx.First(&existingCustomer, *req.CustomerID).Error; err != nil {
				return errors.New("Khách hàng không tồn tại")
			}
			finalCustomerID = req.CustomerID
		}

		// --- 2. TÍNH TOÁN VÀ TRỪ TỒN KHO ---
		totalAmount := 0.0
		orderItems := make([]models.OrderItem, 0, len(items))

		for _, item := range items {
			var product models.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("Inventory").First(&product, item.ProductID).Error; err != nil {
				return errors.New("Sản phẩm không tồn tại")
			}
			if product.Status != "active" {
				return errors.New("Sản phẩm không khả dụng")
			}
			if product.Inventory == nil {
				return errors.New("Tồn kho sản phẩm không tồn tại")
			}
			if product.Inventory.CurrentStock < item.Quantity {
				return errors.New("Sản phẩm không đủ tồn kho")
			}

			unitPrice := product.Price
			subtotal := unitPrice * float64(item.Quantity)
			totalAmount += subtotal

			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", product.ID).Update("current_stock", gorm.Expr("current_stock - ?", item.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi cập nhật tồn kho")
			}

			orderItems = append(orderItems, models.OrderItem{
				ProductID: product.ID,
				Quantity:  item.Quantity,
				UnitPrice: unitPrice,
				Subtotal:  subtotal,
			})
		}

		// --- 3. TẠO ĐƠN HÀNG VỚI CUSTOMER ID CUỐI CÙNG ---
		// Compute final amount: frontend sends discount as percentage (0-100)
		finalAmount := totalAmount
		if req.Discount > 0 {
			// treat as percent
			finalAmount = totalAmount*(1.0-(req.Discount/100.0))
		}
		finalAmount = finalAmount + req.Tax

		order := &models.Order{
			CustomerID:  finalCustomerID,
			UserID:      userID,
			TotalAmount: totalAmount,
			Discount:    req.Discount,
			Tax:         req.Tax,
			FinalAmount: finalAmount,
			Status:      "Đã_bán",
		}

		if err := s.orderRepo.CreateOrderWithDB(tx, order); err != nil {
			return errors.New("Lỗi khi tạo đơn hàng")
		}

		createdOrderID = order.ID
		for i := range orderItems {
			orderItems[i].OrderID = order.ID
		}

		if err := s.orderRepo.CreateOrderItemsWithDB(tx, orderItems); err != nil {
			return errors.New("Lỗi khi tạo chi tiết đơn hàng")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// --- 4. LẤY LẠI THÔNG TIN ORDER ĐỂ TRẢ VỀ ---
	createdOrder, err := s.orderRepo.GetOrderByIDAndUserID(createdOrderID, userID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy đơn hàng vừa tạo")
	}

	response := s.toOrderResponse(createdOrder)
	return &response, nil
}

// UpdateOrder updates an existing order and rebalances inventory.
func (s *OrderService) UpdateOrder(userID, id uint, req *dto.OrderUpdateRequest) (*dto.OrderResponse, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("Đơn hàng phải có ít nhất một sản phẩm")
	}
	if req.Discount < 0 {
		return nil, errors.New("Giảm giá không hợp lệ")
	}
	if req.Tax < 0 {
		return nil, errors.New("Thuế không hợp lệ")
	}
	if req.CustomerID != nil {
		if _, err := s.customerRepo.GetCustomerByID(*req.CustomerID); err != nil {
			return nil, errors.New("Khách hàng không tồn tại")
		}
	}

	items := normalizeOrderItems(req.Items)
	if len(items) == 0 {
		return nil, errors.New("Đơn hàng phải có ít nhất một sản phẩm hợp lệ")
	}

	var updatedOrderID uint
	err := s.orderRepo.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("OrderItems").First(&order, "id = ? AND user_id = ?", id, userID).Error; err != nil {
			return errors.New("Đơn hàng không tồn tại")
		}
		if order.Status != "Đã_bán" {
			return errors.New("Chỉ có thể cập nhật đơn hàng đã bán")
		}

		for _, oldItem := range order.OrderItems {
			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", oldItem.ProductID).Update("current_stock", gorm.Expr("current_stock + ?", oldItem.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi hoàn tồn kho cũ")
			}
		}

		if err := s.orderRepo.DeleteOrderItemsWithDB(tx, order.ID); err != nil {
			return errors.New("Lỗi khi xóa chi tiết đơn hàng cũ")
		}

		totalAmount := 0.0
		newItems := make([]models.OrderItem, 0, len(items))
		for _, item := range items {
			var product models.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("Inventory").First(&product, item.ProductID).Error; err != nil {
				return errors.New("Sản phẩm không tồn tại")
			}
			if product.Status != "active" {
				return errors.New("Sản phẩm không khả dụng")
			}
			if product.Inventory == nil {
				return errors.New("Tồn kho sản phẩm không tồn tại")
			}
			if product.Inventory.CurrentStock < item.Quantity {
				return errors.New("Sản phẩm không đủ tồn kho")
			}

			unitPrice := product.Price
			subtotal := unitPrice * float64(item.Quantity)
			totalAmount += subtotal

			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", product.ID).Update("current_stock", gorm.Expr("current_stock - ?", item.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi cập nhật tồn kho")
			}

			newItems = append(newItems, models.OrderItem{
				OrderID:   order.ID,
				ProductID: product.ID,
				Quantity:  item.Quantity,
				UnitPrice: unitPrice,
				Subtotal:  subtotal,
			})
		}

		order.CustomerID = req.CustomerID
		order.TotalAmount = totalAmount
		order.Discount = req.Discount
		order.Tax = req.Tax
		// treat Discount as percentage
		updatedFinal := totalAmount
		if req.Discount > 0 {
			updatedFinal = totalAmount*(1.0-(req.Discount/100.0))
		}
		updatedFinal = updatedFinal + req.Tax
		order.FinalAmount = updatedFinal

		if err := s.orderRepo.UpdateOrderWithDB(tx, &order); err != nil {
			return errors.New("Lỗi khi cập nhật đơn hàng")
		}
		if err := s.orderRepo.CreateOrderItemsWithDB(tx, newItems); err != nil {
			return errors.New("Lỗi khi tạo chi tiết đơn hàng")
		}

		updatedOrderID = order.ID
		return nil
	})
	if err != nil {
		return nil, err
	}

	updatedOrder, err := s.orderRepo.GetOrderByIDAndUserID(updatedOrderID, userID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy đơn hàng vừa cập nhật")
	}

	response := s.toOrderResponse(updatedOrder)
	return &response, nil
}

// DeleteOrder deletes an existing order and restores inventory.
func (s *OrderService) DeleteOrder(userID, id uint) error {
	return s.orderRepo.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("OrderItems").First(&order, "id = ? AND user_id = ?", id, userID).Error; err != nil {
			return errors.New("Đơn hàng không tồn tại")
		}
		if order.Status != "Đã_bán" {
			return errors.New("Chỉ có thể xóa đơn hàng đã bán")
		}

		for _, item := range order.OrderItems {
			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", item.ProductID).Update("current_stock", gorm.Expr("current_stock + ?", item.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi hoàn tồn kho")
			}
		}

		if err := s.orderRepo.DeleteOrderItemsWithDB(tx, order.ID); err != nil {
			return errors.New("Lỗi khi xóa chi tiết đơn hàng")
		}

		if err := s.orderRepo.DeleteOrderWithDB(tx, order.ID); err != nil {
			return errors.New("Lỗi khi xóa đơn hàng")
		}

		return nil
	})
}

// ReturnOrder changes status from Đã_bán to Đã_trả if the order is not older than one month.
func (s *OrderService) ReturnOrder(userID, id uint) (*dto.OrderResponse, error) {
	var returnedOrderID uint
	err := s.orderRepo.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Preload("OrderItems").First(&order, "id = ? AND user_id = ?", id, userID).Error; err != nil {
			return errors.New("Đơn hàng không tồn tại")
		}
		if order.Status != "Đã_bán" {
			return errors.New("Chỉ có thể đổi trạng thái đơn hàng đã bán")
		}
		if time.Now().After(order.CreatedAt.AddDate(0, 1, 0)) {
			return errors.New("Đơn hàng đã quá thời hạn một tháng để trả")
		}

		for _, item := range order.OrderItems {
			if err := tx.Model(&models.Inventory{}).Where("product_id = ?", item.ProductID).Update("current_stock", gorm.Expr("current_stock + ?", item.Quantity)).Error; err != nil {
				return errors.New("Lỗi khi hoàn tồn kho")
			}
		}

		order.Status = "Đã_trả"
		if err := s.orderRepo.UpdateOrderWithDB(tx, &order); err != nil {
			return errors.New("Lỗi khi cập nhật trạng thái đơn hàng")
		}

		returnedOrderID = order.ID
		return nil
	})
	if err != nil {
		return nil, err
	}

	order, err := s.orderRepo.GetOrderByIDAndUserID(returnedOrderID, userID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin đơn hàng")
	}

	response := s.toOrderResponse(order)
	return &response, nil
}

func (s *OrderService) toOrderResponse(order *models.Order) dto.OrderResponse {
	response := dto.OrderResponse{
		ID:          order.ID,
		CustomerID:  order.CustomerID,
		UserID:      order.UserID,
		TotalAmount: order.TotalAmount,
		Discount:    order.Discount,
		Tax:         order.Tax,
		FinalAmount: order.FinalAmount,
		Status:      order.Status,
		CreatedAt:   order.CreatedAt,
	}

	if order.Customer != nil {
		response.CustomerName = order.Customer.Name
		response.CustomerPhone = order.Customer.Phone
		response.CustomerAddress = order.Customer.Address
	}

	items := make([]dto.OrderItemResponse, 0, len(order.OrderItems))
	for _, item := range order.OrderItems {
		itemResponse := dto.OrderItemResponse{
			ID:        item.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			UnitPrice: item.UnitPrice,
			Subtotal:  item.Subtotal,
		}
		if item.Product.ID != 0 {
			itemResponse.ProductName = item.Product.Name
			itemResponse.SKU = item.Product.SKU
			itemResponse.StockLeft = 0
			if item.Product.Inventory != nil {
				itemResponse.StockLeft = item.Product.Inventory.CurrentStock
			}
			if item.Product.Category.ID != 0 {
				itemResponse.CategoryName = item.Product.Category.Name
			}
			if item.Product.Supplier.ID != 0 {
				itemResponse.SupplierName = item.Product.Supplier.Name
			}
		}
		items = append(items, itemResponse)
	}
	response.Items = items

	return response
}

func normalizeOrderItems(items []dto.OrderItemRequest) []dto.OrderItemRequest {
	merged := make(map[uint]int64)
	order := make([]uint, 0, len(items))
	for _, item := range items {
		if item.ProductID == 0 || item.Quantity <= 0 {
			continue
		}
		if _, exists := merged[item.ProductID]; !exists {
			order = append(order, item.ProductID)
		}
		merged[item.ProductID] += item.Quantity
	}

	result := make([]dto.OrderItemRequest, 0, len(order))
	for _, productID := range order {
		result = append(result, dto.OrderItemRequest{ProductID: productID, Quantity: merged[productID]})
	}
	return result
}
