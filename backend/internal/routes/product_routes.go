package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ProductRoutes sets up product management routes for owner
func ProductRoutes(r *gin.RouterGroup, db *gorm.DB) {
	productRepo := repository.NewProductRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	supplierRepo := repository.NewSupplierRepository(db)
	inventoryRepo := repository.NewInventoryRepository(db)

	productService := services.NewProductService(productRepo, categoryRepo, supplierRepo, inventoryRepo)
	productCtrl := controllers.NewProductController(productService)

	products := r.Group("/products")
	{
		products.GET("", productCtrl.GetAllProducts)
		products.GET("/:id", productCtrl.GetProduct)
		products.POST("", productCtrl.CreateProduct)
		products.PUT("/:id", productCtrl.UpdateProduct)
		products.DELETE("/:id", productCtrl.DeleteProduct)
	}
}
