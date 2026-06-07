package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type SupplierRepository struct {
	DB *gorm.DB
}

// NewSupplierRepository creates a new supplier repository
func NewSupplierRepository(db *gorm.DB) *SupplierRepository {
	return &SupplierRepository{DB: db}
}

// GetAllSuppliersByStore retrieves all suppliers by storeID
func (r *SupplierRepository) GetAllSuppliersByStore(storeID uint) ([]models.Supplier, error) {
	var suppliers []models.Supplier
	// include global suppliers (store_id = 0) and store-specific suppliers
	result := r.DB.Where("store_id = ? OR store_id = 0", storeID).Find(&suppliers)
	return suppliers, result.Error
}

// GetSupplierByID retrieves a supplier by ID
func (r *SupplierRepository) GetSupplierByID(id uint) (*models.Supplier, error) {
	var supplier models.Supplier
	result := r.DB.First(&supplier, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &supplier, nil
}

// GetSupplierByIDAndStore retrieves a supplier by ID and storeID
func (r *SupplierRepository) GetSupplierByIDAndStore(id uint, storeID uint) (*models.Supplier, error) {
	var supplier models.Supplier
	// allow suppliers that belong to the specific store or are global (store_id = 0)
	result := r.DB.Where("id = ? AND (store_id = ? OR store_id = 0)", id, storeID).First(&supplier)
	if result.Error != nil {
		return nil, result.Error
	}
	return &supplier, nil
}

// CheckSupplierEmailExists checks if email already exists
func (r *SupplierRepository) CheckSupplierEmailExists(email string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Supplier{}).Where("email = ?", email).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckSupplierEmailExistsExcept checks if email exists excluding a specific ID
func (r *SupplierRepository) CheckSupplierEmailExistsExcept(email string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Supplier{}).Where("email = ? AND id != ?", email, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateSupplier creates a new supplier
func (r *SupplierRepository) CreateSupplier(supplier *models.Supplier) error {
	return r.DB.Create(supplier).Error
}

// UpdateSupplier updates an existing supplier
func (r *SupplierRepository) UpdateSupplier(supplier *models.Supplier) error {
	return r.DB.Model(supplier).Updates(supplier).Error
}

// DeleteSupplier deletes a supplier by ID
func (r *SupplierRepository) DeleteSupplier(id uint) error {
	return r.DB.Delete(&models.Supplier{}, id).Error
}

// GetSupplierCount returns the total count of suppliers
func (r *SupplierRepository) GetSupplierCount() (int64, error) {
	var count int64
	result := r.DB.Model(&models.Supplier{}).Count(&count)
	return count, result.Error
}
