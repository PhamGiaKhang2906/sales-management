package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PurchaseOrderRoutes(r *gin.RouterGroup, db *gorm.DB) {
	poRepo := repository.NewPurchaseOrderRepository(db)
	supplierRepo := repository.NewSupplierRepository(db)
	productRepo := repository.NewProductRepository(db)
	inventoryRepo := repository.NewInventoryRepository(db)

	poService := services.NewPurchaseOrderService(poRepo, supplierRepo, productRepo, inventoryRepo)
	poCtrl := controllers.NewPurchaseOrderController(poService)
	po := r.Group("/purchase-orders")
	{
		po.GET("", poCtrl.GetAll)
		po.GET(":id", poCtrl.Get)
		po.POST("", poCtrl.Create)
		po.PATCH(":id/return", poCtrl.Return)
	}
	// Note: this function expects the caller to mount it under an authorized group and a path prefix
	_ = poCtrl
	_ = poService
	_ = poRepo
	_ = supplierRepo
	_ = productRepo
	_ = inventoryRepo
}
