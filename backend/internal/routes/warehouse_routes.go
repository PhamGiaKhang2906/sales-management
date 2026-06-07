package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func WarehouseRoutes(r *gin.RouterGroup, db *gorm.DB) {
	poRepo := repository.NewPurchaseOrderRepository(db)
	productRepo := repository.NewProductRepository(db)
	supplierRepo := repository.NewSupplierRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	inventoryRepo := repository.NewInventoryRepository(db)

	// services / controllers used by warehouse routes
	whService := services.NewWarehouseService(poRepo, productRepo)
	whCtrl := controllers.NewWarehouseController(whService)

	productService := services.NewProductService(productRepo, categoryRepo, supplierRepo, inventoryRepo)
	productCtrl := controllers.NewProductController(productService)

	supplierService := services.NewSupplierService(supplierRepo)
	supplierCtrl := controllers.NewSupplierController(supplierService)

	wh := r.Group("/warehouse")
	{
		// Dashboard
		wh.GET("/dashboard", whCtrl.Dashboard)

		// Allow warehouse users to list products and suppliers for PO creation
		wh.GET("/products", productCtrl.GetAllProducts)
		wh.GET("/suppliers", supplierCtrl.GetAllSuppliers)
		// Purchase order CRUD for warehouse
		PurchaseOrderRoutes(wh, db)
	}
}
