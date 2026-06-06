package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type StoreTypeRepository struct {
	DB *gorm.DB
}

// NewStoreTypeRepository creates a new store type repository
func NewStoreTypeRepository(db *gorm.DB) *StoreTypeRepository {
	return &StoreTypeRepository{DB: db}
}

// GetAllStoreTypes retrieves all store types
func (r *StoreTypeRepository) GetAllStoreTypes() ([]models.StoreType, error) {
	var storeTypes []models.StoreType
	result := r.DB.Find(&storeTypes)
	return storeTypes, result.Error
}

// GetStoreTypeByID retrieves a store type by ID
func (r *StoreTypeRepository) GetStoreTypeByID(id uint) (*models.StoreType, error) {
	var storeType models.StoreType
	result := r.DB.First(&storeType, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &storeType, nil
}

// GetListStoreTypeName retrieves the name of a store type in database
func (r *StoreTypeRepository) GetListStoreTypeName() ([]string, error) {
	var names []string
	result := r.DB.Model(&models.StoreType{}).Pluck("name", &names)
	return names, result.Error
}

// CheckStoreTypeNameExists checks if store type name already exists
func (r *StoreTypeRepository) CheckStoreTypeNameExists(name string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.StoreType{}).Where("name = ?", name).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckStoreTypeNameExistsExcept checks if name exists excluding a specific ID
func (r *StoreTypeRepository) CheckStoreTypeNameExistsExcept(name string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.StoreType{}).Where("name = ? AND id != ?", name, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateStoreType creates a new store type
func (r *StoreTypeRepository) CreateStoreType(storeType *models.StoreType) error {
	return r.DB.Create(storeType).Error
}

// UpdateStoreType updates an existing store type
func (r *StoreTypeRepository) UpdateStoreType(storeType *models.StoreType) error {
	return r.DB.Model(storeType).Update("name", storeType.Name).Error
}

// DeleteStoreType deletes a store type by ID
func (r *StoreTypeRepository) DeleteStoreType(id uint) error {
	return r.DB.Delete(&models.StoreType{}, id).Error
}

// GetStoreTypeCount returns the total count of store types
func (r *StoreTypeRepository) GetStoreTypeCount() (int64, error) {
	var count int64
	result := r.DB.Model(&models.StoreType{}).Count(&count)
	return count, result.Error
}

// GetStoreStatistics returns total number of stores and the most popular store type name
func (r *StoreTypeRepository) GetStoreStatistics() (int64, string, error) {
	var totalStores int64

	if err := r.DB.Table("stores").Count(&totalStores).Error; err != nil {
		return 0, "", err
	}

	var popularTypeName string
	if totalStores > 0 {
		var result struct {
			Name string
		}

		err := r.DB.Table("store_types").
			Select("store_types.name").
			Joins("JOIN stores ON stores.store_type_id = store_types.id").
			Group("store_types.id, store_types.name").
			Order("COUNT(stores.id) DESC").
			Limit(1).
			Scan(&result).Error

		if err != nil {
			return totalStores, "", err
		}
		popularTypeName = result.Name
	}

	return totalStores, popularTypeName, nil
}
