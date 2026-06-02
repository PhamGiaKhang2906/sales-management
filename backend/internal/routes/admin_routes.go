package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AdminRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	storeTypeRepo := repository.NewStoreTypeRepository(db)

	// Initialize services
	adminAccountService := services.NewAdminAccountService(userRepo)
	storeTypeService := services.NewStoreTypeService(storeTypeRepo)

	// Initialize controllers
	adminAccountCtrl := controllers.NewAdminAccountController(adminAccountService)
	storeTypeCtrl := controllers.NewStoreTypeController(storeTypeService)

	// Admin routes group
	admin := r.Group("/admin")
	{
		// Account management routes
		admin.GET("/accounts", adminAccountCtrl.GetAccounts)
		admin.PUT("/accounts/status", adminAccountCtrl.ChangeAccountStatus)

		// Store type management routes
		admin.GET("/store-types", storeTypeCtrl.GetAllStoreTypes)
		admin.POST("/store-types", storeTypeCtrl.CreateStoreType)
		admin.PUT("/store-types/:id", storeTypeCtrl.UpdateStoreType)
		admin.DELETE("/store-types/:id", storeTypeCtrl.DeleteStoreType)
	}
}
