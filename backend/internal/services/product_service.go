package services

import (
	"errors"
	"strconv"
	"strings"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"gorm.io/gorm"
)

type ProductService struct {
	productRepo  *repository.ProductRepository
	categoryRepo *repository.CategoryRepository
	supplierRepo *repository.SupplierRepository
}

// NewProductService creates a new product service
func NewProductService(productRepo *repository.ProductRepository, categoryRepo *repository.CategoryRepository, supplierRepo *repository.SupplierRepository) *ProductService {
	return &ProductService{
		productRepo:  productRepo,
		categoryRepo: categoryRepo,
		supplierRepo: supplierRepo,
	}
}

// GetAllProducts retrieves all products
func (s *ProductService) GetAllProducts() (*dto.ProductsListResponse, error) {
	products, err := s.productRepo.GetAllProducts()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách sản phẩm")
	}

	responses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		responses = append(responses, s.toProductResponse(&product))
	}

	return &dto.ProductsListResponse{
		Products: responses,
		Total:    len(responses),
	}, nil
}

// SearchProducts retrieves products using search and filter criteria.
func (s *ProductService) SearchProducts(search string, idParam string, categoryIDParam string, supplierIDParam string, stockStatus string) (*dto.ProductsListResponse, error) {
	filters := repository.ProductFilters{
		Search:      strings.TrimSpace(search),
		StockStatus: strings.ToLower(strings.TrimSpace(stockStatus)),
	}

	if idParam != "" {
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return nil, errors.New("ID sản phẩm không hợp lệ")
		}
		parsedID := uint(id)
		filters.ID = &parsedID
	}

	if categoryIDParam != "" {
		categoryID, err := strconv.ParseUint(categoryIDParam, 10, 32)
		if err != nil {
			return nil, errors.New("ID danh mục không hợp lệ")
		}
		parsedCategoryID := uint(categoryID)
		filters.CategoryID = &parsedCategoryID
	}

	if supplierIDParam != "" {
		supplierID, err := strconv.ParseUint(supplierIDParam, 10, 32)
		if err != nil {
			return nil, errors.New("ID nhà cung cấp không hợp lệ")
		}
		parsedSupplierID := uint(supplierID)
		filters.SupplierID = &parsedSupplierID
	}

	products, err := s.productRepo.SearchProducts(filters)
	if err != nil {
		return nil, errors.New("Lỗi khi tìm kiếm sản phẩm")
	}

	responses := make([]dto.ProductResponse, 0, len(products))
	for _, product := range products {
		responses = append(responses, s.toProductResponse(&product))
	}

	return &dto.ProductsListResponse{
		Products: responses,
		Total:    len(responses),
	}, nil
}

// GetProductByID retrieves a product by ID
func (s *ProductService) GetProductByID(id uint) (*dto.ProductResponse, error) {
	product, err := s.productRepo.GetProductByID(id)
	if err != nil {
		return nil, errors.New("Sản phẩm không tồn tại")
	}

	response := s.toProductResponse(product)
	return &response, nil
}

// CreateProduct creates a new product
func (s *ProductService) CreateProduct(req *dto.ProductCreateRequest) (*dto.ProductResponse, error) {
	if req.CategoryID == 0 {
		return nil, errors.New("Danh mục không được để trống")
	}
	if req.SupplierID == 0 {
		return nil, errors.New("Nhà cung cấp không được để trống")
	}
	if req.SKU == "" {
		return nil, errors.New("SKU không được để trống")
	}
	if req.Name == "" {
		return nil, errors.New("Tên sản phẩm không được để trống")
	}
	if req.Price <= 0 {
		return nil, errors.New("Giá sản phẩm phải lớn hơn 0")
	}

	if _, err := s.categoryRepo.GetCategoryByID(req.CategoryID); err != nil {
		return nil, errors.New("Danh mục không tồn tại")
	}
	if _, err := s.supplierRepo.GetSupplierByID(req.SupplierID); err != nil {
		return nil, errors.New("Nhà cung cấp không tồn tại")
	}

	exists, err := s.productRepo.CheckProductSKUExists(req.SKU)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra SKU sản phẩm")
	}
	if exists {
		return nil, errors.New("SKU sản phẩm đã tồn tại")
	}

	status := req.Status
	if status == "" {
		status = "active"
	}

	product := &models.Product{
		CategoryID: req.CategoryID,
		SupplierID: req.SupplierID,
		SKU:        req.SKU,
		Barcode:    req.Barcode,
		Name:       req.Name,
		Unit:       req.Unit,
		Price:      req.Price,
		Status:     status,
	}

	err = s.productRepo.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(product).Error; err != nil {
			return err
		}

		inventory := &models.Inventory{
			ProductID:    product.ID,
			CurrentStock: 0,
			MinStock:     0,
		}

		if err := tx.Create(inventory).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, errors.New("Lỗi khi tạo sản phẩm")
	}

	createdProduct, err := s.productRepo.GetProductByID(product.ID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin sản phẩm vừa tạo")
	}

	response := s.toProductResponse(createdProduct)
	return &response, nil
}

// UpdateProduct updates an existing product
func (s *ProductService) UpdateProduct(id uint, req *dto.ProductUpdateRequest) (*dto.ProductResponse, error) {
	if req.CategoryID == 0 {
		return nil, errors.New("Danh mục không được để trống")
	}
	if req.SupplierID == 0 {
		return nil, errors.New("Nhà cung cấp không được để trống")
	}
	if req.SKU == "" {
		return nil, errors.New("SKU không được để trống")
	}
	if req.Name == "" {
		return nil, errors.New("Tên sản phẩm không được để trống")
	}
	if req.Price <= 0 {
		return nil, errors.New("Giá sản phẩm phải lớn hơn 0")
	}

	product, err := s.productRepo.GetProductByID(id)
	if err != nil {
		return nil, errors.New("Sản phẩm không tồn tại")
	}

	if _, err := s.categoryRepo.GetCategoryByID(req.CategoryID); err != nil {
		return nil, errors.New("Danh mục không tồn tại")
	}
	if _, err := s.supplierRepo.GetSupplierByID(req.SupplierID); err != nil {
		return nil, errors.New("Nhà cung cấp không tồn tại")
	}

	exists, err := s.productRepo.CheckProductSKUExistsExcept(req.SKU, id)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra SKU sản phẩm")
	}
	if exists {
		return nil, errors.New("SKU sản phẩm đã tồn tại")
	}

	product.CategoryID = req.CategoryID
	product.SupplierID = req.SupplierID
	product.SKU = req.SKU
	product.Barcode = req.Barcode
	product.Name = req.Name
	product.Unit = req.Unit
	product.Price = req.Price
	if req.Status != "" {
		product.Status = req.Status
	} else if product.Status == "" {
		product.Status = "active"
	}

	if err := s.productRepo.UpdateProduct(product); err != nil {
		return nil, errors.New("Lỗi khi cập nhật sản phẩm")
	}

	updatedProduct, err := s.productRepo.GetProductByID(id)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin sản phẩm vừa cập nhật")
	}

	response := s.toProductResponse(updatedProduct)
	return &response, nil
}

// DeleteProduct deletes a product by ID
func (s *ProductService) DeleteProduct(id uint) error {
	if _, err := s.productRepo.GetProductByID(id); err != nil {
		return errors.New("Sản phẩm không tồn tại")
	}

	if err := s.productRepo.DeleteProduct(id); err != nil {
		return errors.New("Lỗi khi xóa sản phẩm")
	}

	return nil
}

func (s *ProductService) toProductResponse(product *models.Product) dto.ProductResponse {
	response := dto.ProductResponse{
		ID:           product.ID,
		CategoryID:   product.CategoryID,
		SupplierID:   product.SupplierID,
		SKU:          product.SKU,
		Barcode:      product.Barcode,
		Name:         product.Name,
		Unit:         product.Unit,
		Price:        product.Price,
		Status:       product.Status,
		CategoryName: product.Category.Name,
		SupplierName: product.Supplier.Name,
	}

	if product.Inventory != nil {
		response.CurrentStock = product.Inventory.CurrentStock
		response.MinStock = product.Inventory.MinStock
	}

	return response
}
