package routes

import (
	"net/http"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
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
		// Current user's employee profile
		employeeRepo := repository.NewEmployeeRepository(db)
		wh.GET("/profile", func(c *gin.Context) {
			// get userID from context (set by auth middleware)
			v, exists := c.Get("userID")
			if !exists {
				utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin người dùng")
				return
			}
			var userID uint
			switch t := v.(type) {
			case uint:
				userID = t
			case int:
				userID = uint(t)
			case float64:
				userID = uint(t)
			default:
				utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin người dùng không hợp lệ")
				return
			}

			emp, err := employeeRepo.GetEmployeeByUserID(userID)
			if err != nil {
				utils.ErrorResponse(c, http.StatusNotFound, "Không tìm thấy thông tin nhân viên: "+err.Error())
				return
			}

			birthdayStr := ""
			if emp.Birthday != nil {
				birthdayStr = emp.Birthday.Format("2006-01-02")
			}

			resp := dto.EmployeeResponse{
				ID:           emp.ID,
				UserID:       emp.UserID,
				Username:     emp.User.Username,
				Fullname:     emp.User.FullName,
				Phone:        emp.User.Phone,
				CCCD:         emp.CCCD,
				Address:      emp.Address,
				Birthday:     &birthdayStr,
				SalaryFactor: emp.SalaryFactor,
				WorkShift:    emp.WorkShift,
				Status:       emp.User.Status,
				CreatedAt:    emp.User.CreatedAt.Format("2006-01-02 15:04:05"),
			}

			utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin nhân viên thành công", resp)
		})
		// Purchase order CRUD for warehouse
		PurchaseOrderRoutes(wh, db)
	}
}
