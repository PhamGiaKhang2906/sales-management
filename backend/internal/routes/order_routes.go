package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// OrderRoutes sets up order routes for sales users.
func OrderRoutes(r *gin.RouterGroup, db *gorm.DB) {
	orderRepo := repository.NewOrderRepository(db)
	productRepo := repository.NewProductRepository(db)
	customerRepo := repository.NewCustomerRepository(db)

	orderService := services.NewOrderService(orderRepo, productRepo, customerRepo)
	orderCtrl := controllers.NewOrderController(orderService)

	orders := r.Group("/orders")
	{
		orders.GET("", orderCtrl.GetAllOrders)
		orders.GET("/:id", orderCtrl.GetOrder)
		orders.POST("", orderCtrl.CreateOrder)
		orders.PUT("/:id", orderCtrl.UpdateOrder)
		orders.DELETE("/:id", orderCtrl.DeleteOrder)
		orders.PATCH("/:id/return", orderCtrl.ReturnOrder)
	}
}
