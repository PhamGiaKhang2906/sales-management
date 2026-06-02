package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type EmployeeController struct {
	employeeService *services.EmployeeService
}

// NewEmployeeController creates a new employee controller
func NewEmployeeController(employeeService *services.EmployeeService) *EmployeeController {
	return &EmployeeController{
		employeeService: employeeService,
	}
}

// GetAllEmployees retrieves all employees for the owner's store
func (ctrl *EmployeeController) GetAllEmployees(c *gin.Context) {
	// Get store ID from context (set by middleware from JWT)
	storeID, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không thể xác định cửa hàng")
		return
	}

	response, err := ctrl.employeeService.GetAllEmployees(storeID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách nhân viên thành công", response)
}

// CreateEmployee creates a new employee with user account
func (ctrl *EmployeeController) CreateEmployee(c *gin.Context) {
	// Get store ID from context
	storeID, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không thể xác định cửa hàng")
		return
	}

	var req dto.EmployeeCreateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.employeeService.CreateEmployee(storeID.(uint), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo nhân viên thành công", response)
}

// UpdateEmployee updates an existing employee
func (ctrl *EmployeeController) UpdateEmployee(c *gin.Context) {
	// Get store ID from context
	storeID, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không thể xác định cửa hàng")
		return
	}

	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.EmployeeUpdateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.employeeService.UpdateEmployee(uint(id), storeID.(uint), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật nhân viên thành công", response)
}

// DeleteEmployee deletes an employee by ID
func (ctrl *EmployeeController) DeleteEmployee(c *gin.Context) {
	// Get store ID from context
	storeID, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không thể xác định cửa hàng")
		return
	}

	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	// Call service
	err = ctrl.employeeService.DeleteEmployee(uint(id), storeID.(uint))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa nhân viên thành công", nil)
}
