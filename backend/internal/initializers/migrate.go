package initializers

import (
	"time"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
)

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
		&models.PurchaseOrder{},
		&models.PurchaseOrderItem{},
	)

	// Create default roles if they don't exist
	roleNames := []string{"owner", "sales", "warehouse", "admin"}
	for _, roleName := range roleNames {
		var role models.Role
		DB.Where(models.Role{RoleName: roleName}).FirstOrCreate(&role, models.Role{RoleName: roleName})
	}

	// Create Admin user and store if not exists
	var adminRole models.Role
	DB.Where(models.Role{RoleName: "admin"}).First(&adminRole)

	if adminRole.ID != 0 {
		var adminUser models.User
		DB.Where(models.User{Username: "Khang"}).First(&adminUser)

		if adminUser.ID == 0 {
			// Hash password
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte("123456789"), bcrypt.DefaultCost)
			if err != nil {
				panic("Failed to hash password for admin user")
			}

			// Create Admin user
			adminUser = models.User{
				Username:  "Khang",
				Password:  string(hashedPassword),
				Phone:     "0941501609",
				FullName:  "Phạm Gia Khang",
				RoleID:    adminRole.ID,
				Status:    "Đã_duyệt",
				CreatedAt: time.Now(),
			}
			DB.Create(&adminUser)
		}
	}
}
