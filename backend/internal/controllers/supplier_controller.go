package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type SupplierController struct {
	supplierService *services.SupplierService
}

// NewSupplierController creates a new supplier controller
func NewSupplierController(supplierService *services.SupplierService) *SupplierController {
	return &SupplierController{
		supplierService: supplierService,
	}
}

// GetAllSuppliers retrieves all suppliers
func (ctrl *SupplierController) GetAllSuppliers(c *gin.Context) {
	// Lấy storeID từ context (được set bởi middleware)
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	var storeID uint
	switch v := storeVal.(type) {
	case uint:
		storeID = v
	case int:
		storeID = uint(v)
	case float64:
		storeID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	response, err := ctrl.supplierService.GetAllSuppliers(storeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách nhà cung cấp thành công", response)
}

// CreateSupplier creates a new supplier
func (ctrl *SupplierController) CreateSupplier(c *gin.Context) {
	var req dto.SupplierCreateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get storeID from context and set into request
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	switch v := storeVal.(type) {
	case uint:
		req.StoreID = v
	case int:
		req.StoreID = uint(v)
	case float64:
		req.StoreID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	// Call service
	response, err := ctrl.supplierService.CreateSupplier(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo nhà cung cấp thành công", response)
}

// UpdateSupplier updates an existing supplier
func (ctrl *SupplierController) UpdateSupplier(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.SupplierUpdateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.supplierService.UpdateSupplier(uint(id), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật nhà cung cấp thành công", response)
}

// DeleteSupplier deletes a supplier by ID
func (ctrl *SupplierController) DeleteSupplier(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	// Call service
	err = ctrl.supplierService.DeleteSupplier(uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa nhà cung cấp thành công", nil)
}

// GetSupplier retrieves a supplier by ID
func (ctrl *SupplierController) GetSupplier(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID nhà cung cấp không hợp lệ")
		return
	}

	// Call service
	response, err := ctrl.supplierService.GetSupplier(uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin nhà cung cấp thành công", response)
}
