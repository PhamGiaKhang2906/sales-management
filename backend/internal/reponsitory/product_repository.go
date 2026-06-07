package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type ProductFilters struct {
	Search      string
	ID          *uint
	CategoryID  *uint
	SupplierID  *uint
	StockStatus string
}

type ProductRepository struct {
	DB *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{DB: db}
}

func (r *ProductRepository) GetAllProductsByStore(storeID uint) ([]models.Product, error) {
	var products []models.Product
	result := r.DB.Preload("Category").Preload("Supplier").Preload("Inventory").
		Where("products.store_id = ?", storeID).
		Order("products.id DESC").Find(&products)
	return products, result.Error
}

func (r *ProductRepository) SearchProducts(storeID uint, filters ProductFilters) ([]models.Product, error) {
	query := r.DB.Model(&models.Product{}).
		Where("products.store_id = ?", storeID).
		Preload("Category").
		Preload("Supplier").
		Joins("Inventory")

	if filters.CategoryID != nil {
		query = query.Where("products.category_id = ?", *filters.CategoryID)
	}

	if filters.SupplierID != nil {
		query = query.Where("products.supplier_id = ?", *filters.SupplierID)
	}

	if filters.Search != "" {
		query = query.Where("products.name ILIKE ? OR products.sku ILIKE ?", "%"+filters.Search+"%", "%"+filters.Search+"%")
	}

	switch filters.StockStatus {
	case "in":
		query = query.Where("\"Inventory\".current_stock > 0")
	case "out":
		query = query.Where("COALESCE(\"Inventory\".current_stock, 0) = 0")
	}

	var products []models.Product
	result := query.Order("products.id DESC").Find(&products)
	return products, result.Error
}

func (r *ProductRepository) CreateProduct(product *models.Product) error {
	return r.DB.Create(product).Error
}

func (r *ProductRepository) UpdateProduct(product *models.Product) error {
	return r.DB.Model(product).Updates(product).Error
}

func (r *ProductRepository) DeleteProduct(id uint, storeID uint) error {
	return r.DB.Where("id = ? AND store_id = ?", id, storeID).Delete(&models.Product{}).Error
}

func (r *ProductRepository) GetProductByIDAndStore(id uint, storeID uint) (*models.Product, error) {
	var product models.Product
	result := r.DB.Preload("Category").Preload("Supplier").Preload("Inventory").
		Where("id = ? AND store_id = ?", id, storeID).First(&product)
	return &product, result.Error
}

func (r *ProductRepository) CheckProductSKUExists(sku string, storeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Product{}).Where("sku = ? AND store_id = ?", sku, storeID).Count(&count)
	return count > 0, result.Error
}

func (r *ProductRepository) CheckProductSKUExistsExcept(sku string, id uint, storeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Product{}).Where("sku = ? AND id <> ? AND store_id = ?", sku, id, storeID).Count(&count)
	return count > 0, result.Error
}
