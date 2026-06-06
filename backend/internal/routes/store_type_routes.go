package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupStoreTypeRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Initialize repositories
	storeTypeRepo := repository.NewStoreTypeRepository(db)

	// Initialize services
	storeTypeService := services.NewStoreTypeService(storeTypeRepo)

	// Initialize controllers
	storeTypeCtrl := controllers.NewStoreTypeController(storeTypeService)

	// Store type management routes
	storeTypeGroup := r.Group("/store-types")
	{
		storeTypeGroup.GET("/", storeTypeCtrl.GetAllStoreTypes)
	}
}
