package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/middleware"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SalesRoutes(r *gin.RouterGroup, db *gorm.DB) {
	customerRepo := repository.NewCustomerRepository(db)
	customerService := services.NewCustomerService(customerRepo)
	customerCtrl := controllers.NewCustomerController(customerService)

	sales := r.Group("/sales")
	sales.Use(middleware.SalesOnlyMiddleware(db))
	{
		// Customer management routes for sales
		customers := sales.Group("/customers")
		{
			customers.GET("", customerCtrl.GetAllCustomers)
			customers.GET("/:id", customerCtrl.GetCustomer)
			customers.POST("", customerCtrl.CreateCustomer)
			customers.PUT("/:id", customerCtrl.UpdateCustomer)
			customers.DELETE("/:id", customerCtrl.DeleteCustomer)
		}

		OrderRoutes(sales, db)
	}
}
