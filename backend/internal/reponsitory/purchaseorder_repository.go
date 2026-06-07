package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type PurchaseOrderRepository struct {
	DB *gorm.DB
}

func NewPurchaseOrderRepository(db *gorm.DB) *PurchaseOrderRepository {
	return &PurchaseOrderRepository{DB: db}
}

func (r *PurchaseOrderRepository) preloadQuery(db *gorm.DB) *gorm.DB {
	return db.Preload("Supplier").Preload("User").Preload("Items.Product.Category").Preload("Items.Product.Supplier").Preload("Items.Product.Inventory")
}

func (r *PurchaseOrderRepository) GetPurchaseOrdersByStore(storeID uint) ([]models.PurchaseOrder, error) {
	var orders []models.PurchaseOrder
	result := r.preloadQuery(r.DB).Where("store_id = ?", storeID).Order("id DESC").Find(&orders)
	return orders, result.Error
}

func (r *PurchaseOrderRepository) GetPurchaseOrderByIDAndStore(id, storeID uint) (*models.PurchaseOrder, error) {
	var order models.PurchaseOrder
	result := r.preloadQuery(r.DB).Where("id = ? AND store_id = ?", id, storeID).First(&order)
	if result.Error != nil {
		return nil, result.Error
	}
	return &order, nil
}

func (r *PurchaseOrderRepository) CreatePurchaseOrderWithDB(db *gorm.DB, order *models.PurchaseOrder) error {
	return db.Create(order).Error
}

func (r *PurchaseOrderRepository) CreateItemsWithDB(db *gorm.DB, items []models.PurchaseOrderItem) error {
	if len(items) == 0 {
		return nil
	}
	return db.Create(&items).Error
}

func (r *PurchaseOrderRepository) UpdatePurchaseOrderWithDB(db *gorm.DB, order *models.PurchaseOrder) error {
	return db.Save(order).Error
}
