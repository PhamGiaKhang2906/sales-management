package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type ProductRepository struct {
	DB *gorm.DB
}

// NewProductRepository creates a new product repository
func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{DB: db}
}

// GetAllProducts retrieves all products with related category, supplier and inventory data
func (r *ProductRepository) GetAllProducts() ([]models.Product, error) {
	var products []models.Product
	result := r.DB.Preload("Category").Preload("Supplier").Preload("Inventory").Order("id DESC").Find(&products)
	return products, result.Error
}

// GetProductByID retrieves a product by ID
func (r *ProductRepository) GetProductByID(id uint) (*models.Product, error) {
	var product models.Product
	result := r.DB.Preload("Category").Preload("Supplier").Preload("Inventory").First(&product, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &product, nil
}

// CheckProductSKUExists checks if SKU already exists
func (r *ProductRepository) CheckProductSKUExists(sku string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Product{}).Where("sku = ?", sku).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckProductSKUExistsExcept checks if SKU exists excluding a specific ID
func (r *ProductRepository) CheckProductSKUExistsExcept(sku string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Product{}).Where("sku = ? AND id != ?", sku, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateProduct creates a new product
func (r *ProductRepository) CreateProduct(product *models.Product) error {
	return r.DB.Create(product).Error
}

// UpdateProduct updates an existing product
func (r *ProductRepository) UpdateProduct(product *models.Product) error {
	return r.DB.Model(product).Updates(product).Error
}

// DeleteProduct deletes a product by ID
func (r *ProductRepository) DeleteProduct(id uint) error {
	return r.DB.Delete(&models.Product{}, id).Error
}
