package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type CustomerController struct {
	customerService *services.CustomerService
}

// NewCustomerController creates a new customer controller
func NewCustomerController(customerService *services.CustomerService) *CustomerController {
	return &CustomerController{customerService: customerService}
}

// GetAllCustomers retrieves all customers
func (ctrl *CustomerController) GetAllCustomers(c *gin.Context) {
	response, err := ctrl.customerService.GetAllCustomers()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách khách hàng thành công", response)
}

// GetCustomer retrieves a customer by ID
func (ctrl *CustomerController) GetCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	response, err := ctrl.customerService.GetCustomerByID(uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin khách hàng thành công", response)
}

// CreateCustomer creates a new customer
func (ctrl *CustomerController) CreateCustomer(c *gin.Context) {
	var req dto.CustomerCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	response, err := ctrl.customerService.CreateCustomer(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo khách hàng thành công", response)
}

// UpdateCustomer updates an existing customer
func (ctrl *CustomerController) UpdateCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.CustomerUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	response, err := ctrl.customerService.UpdateCustomer(uint(id), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật khách hàng thành công", response)
}

// DeleteCustomer deletes a customer by ID
func (ctrl *CustomerController) DeleteCustomer(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	if err := ctrl.customerService.DeleteCustomer(uint(id)); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa khách hàng thành công", nil)
}
