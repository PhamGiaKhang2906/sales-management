package initializers

import "github.com/PhamGiaKhang2906/sales-management-backend/internal/models"

func SyncDatabase() {
	DB.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.Employee{},
		&models.Category{},
		&models.Supplier{},
		&models.Product{},
		&models.Inventory{},
		&models.StockLog{},
		&models.Customer{},
		&models.Order{},
		&models.OrderItem{},
		&models.Invoice{},
		&models.Store{},
		&models.StoreType{},
	)
}
