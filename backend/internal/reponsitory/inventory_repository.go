package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type InventoryRepository struct {
	DB *gorm.DB
}

// NewInventoryRepository creates a new inventory repository
func NewInventoryRepository(db *gorm.DB) *InventoryRepository {
	return &InventoryRepository{DB: db}
}

// CreateInventory creates a new inventory record
func (r *InventoryRepository) CreateInventory(inventory *models.Inventory) error {
	return r.DB.Create(inventory).Error
}

// GetInventoryByProductID retrieves an inventory record by product ID
func (r *InventoryRepository) GetInventoryByProductID(productID uint) (*models.Inventory, error) {
	var inventory models.Inventory
	result := r.DB.Where("product_id = ?", productID).First(&inventory)
	if result.Error != nil {
		return nil, result.Error
	}
	return &inventory, nil
}

// UpdateInventory updates an existing inventory record
func (r *InventoryRepository) UpdateInventory(inventory *models.Inventory) error {
	return r.DB.Save(inventory).Error
}
