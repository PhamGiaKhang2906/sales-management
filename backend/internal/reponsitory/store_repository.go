package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type StoreRepository struct {
	DB *gorm.DB
}

// NewStoreRepository creates a new store repository
func NewStoreRepository(db *gorm.DB) *StoreRepository {
	return &StoreRepository{DB: db}
}

// CheckPhoneExists checks if phone already exists in Store
func (r *StoreRepository) CheckPhoneExists(phone string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Store{}).Where("phone = ?", phone).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// GetStoreTypeByName retrieves StoreType by name
func (r *StoreRepository) GetStoreTypeByName(name string) (*models.StoreType, error) {
	var storeType models.StoreType
	result := r.DB.Where("name = ?", name).First(&storeType)
	if result.Error != nil {
		return nil, result.Error
	}
	return &storeType, nil
}

// CreateStore creates a new store in the database
func (r *StoreRepository) CreateStore(store *models.Store) error {
	return r.DB.Create(store).Error
}

// GetStoreByID retrieves a store by ID
func (r *StoreRepository) GetStoreByID(id uint) (*models.Store, error) {
	var store models.Store
	result := r.DB.First(&store, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &store, nil
}
