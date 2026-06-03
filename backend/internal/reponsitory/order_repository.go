package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	DB *gorm.DB
}

// NewOrderRepository creates a new order repository.
func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{DB: db}
}

func (r *OrderRepository) preloadOrderQuery(db *gorm.DB) *gorm.DB {
	return db.
		Preload("Customer").
		Preload("User").
		Preload("OrderItems.Product.Category").
		Preload("OrderItems.Product.Supplier").
		Preload("OrderItems.Product.Inventory")
}

// GetOrdersByUserID retrieves orders belonging to a user.
func (r *OrderRepository) GetOrdersByUserID(userID uint) ([]models.Order, error) {
	var orders []models.Order
	result := r.preloadOrderQuery(r.DB).Where("user_id = ?", userID).Order("id DESC").Find(&orders)
	return orders, result.Error
}

// GetOrderByIDAndUserID retrieves an order by id and user id.
func (r *OrderRepository) GetOrderByIDAndUserID(id, userID uint) (*models.Order, error) {
	var order models.Order
	result := r.preloadOrderQuery(r.DB).Where("id = ? AND user_id = ?", id, userID).First(&order)
	if result.Error != nil {
		return nil, result.Error
	}
	return &order, nil
}

// GetOrderByIDAndUserIDWithDB retrieves an order using the provided DB handle.
func (r *OrderRepository) GetOrderByIDAndUserIDWithDB(db *gorm.DB, id, userID uint) (*models.Order, error) {
	var order models.Order
	result := r.preloadOrderQuery(db).Where("id = ? AND user_id = ?", id, userID).First(&order)
	if result.Error != nil {
		return nil, result.Error
	}
	return &order, nil
}

// CreateOrder creates a new order.
func (r *OrderRepository) CreateOrder(order *models.Order) error {
	return r.DB.Create(order).Error
}

// CreateOrderWithDB creates a new order using the provided DB handle.
func (r *OrderRepository) CreateOrderWithDB(db *gorm.DB, order *models.Order) error {
	return db.Create(order).Error
}

// UpdateOrderWithDB updates an order using the provided DB handle.
func (r *OrderRepository) UpdateOrderWithDB(db *gorm.DB, order *models.Order) error {
	return db.Save(order).Error
}

// DeleteOrderWithDB deletes an order using the provided DB handle.
func (r *OrderRepository) DeleteOrderWithDB(db *gorm.DB, id uint) error {
	return db.Delete(&models.Order{}, id).Error
}

// CreateOrderItemsWithDB creates order items using the provided DB handle.
func (r *OrderRepository) CreateOrderItemsWithDB(db *gorm.DB, items []models.OrderItem) error {
	if len(items) == 0 {
		return nil
	}
	return db.Create(&items).Error
}

// DeleteOrderItemsWithDB deletes all items for an order using the provided DB handle.
func (r *OrderRepository) DeleteOrderItemsWithDB(db *gorm.DB, orderID uint) error {
	return db.Where("order_id = ?", orderID).Delete(&models.OrderItem{}).Error
}
