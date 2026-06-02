package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func OwnerRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Initialize repositories
	supplierRepo := repository.NewSupplierRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	employeeRepo := repository.NewEmployeeRepository(db)
	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)

	// Initialize services
	supplierService := services.NewSupplierService(supplierRepo)
	categoryService := services.NewCategoryService(categoryRepo)
	employeeService := services.NewEmployeeService(employeeRepo, userRepo, roleRepo)

	// Initialize controllers
	supplierCtrl := controllers.NewSupplierController(supplierService)
	categoryCtrl := controllers.NewCategoryController(categoryService)
	employeeCtrl := controllers.NewEmployeeController(employeeService)

	// Owner routes group
	owner := r.Group("/owner")
	{
		// Supplier management routes
		owner.GET("/suppliers", supplierCtrl.GetAllSuppliers)
		owner.POST("/suppliers", supplierCtrl.CreateSupplier)
		owner.PUT("/suppliers/:id", supplierCtrl.UpdateSupplier)
		owner.DELETE("/suppliers/:id", supplierCtrl.DeleteSupplier)

		// Category management routes
		owner.GET("/categories", categoryCtrl.GetAllCategories)
		owner.POST("/categories", categoryCtrl.CreateCategory)
		owner.PUT("/categories/:id", categoryCtrl.UpdateCategory)
		owner.DELETE("/categories/:id", categoryCtrl.DeleteCategory)

		// Employee management routes
		owner.GET("/employees", employeeCtrl.GetAllEmployees)
		owner.POST("/employees", employeeCtrl.CreateEmployee)
		owner.PUT("/employees/:id", employeeCtrl.UpdateEmployee)
		owner.DELETE("/employees/:id", employeeCtrl.DeleteEmployee)
	}
}
