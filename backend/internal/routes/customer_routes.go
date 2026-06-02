package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CustomerRoutes registers customer CRUD routes on the provided router group.
func CustomerRoutes(r *gin.RouterGroup, db *gorm.DB) {
	customerRepo := repository.NewCustomerRepository(db)
	customerService := services.NewCustomerService(customerRepo)
	customerCtrl := controllers.NewCustomerController(customerService)

	customers := r.Group("/customers")
	{
		customers.GET("", customerCtrl.GetAllCustomers)
		customers.GET("/:id", customerCtrl.GetCustomer)
		customers.POST("", customerCtrl.CreateCustomer)
		customers.PUT("/:id", customerCtrl.UpdateCustomer)
		customers.DELETE("/:id", customerCtrl.DeleteCustomer)
	}
}
