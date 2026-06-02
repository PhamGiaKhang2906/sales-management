package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type StoreTypeController struct {
	storeTypeService *services.StoreTypeService
}

// NewStoreTypeController creates a new store type controller
func NewStoreTypeController(storeTypeService *services.StoreTypeService) *StoreTypeController {
	return &StoreTypeController{
		storeTypeService: storeTypeService,
	}
}

// GetAllStoreTypes retrieves all store types
func (ctrl *StoreTypeController) GetAllStoreTypes(c *gin.Context) {
	response, err := ctrl.storeTypeService.GetAllStoreTypes()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách loại cửa hàng thành công", response)
}

// CreateStoreType creates a new store type
func (ctrl *StoreTypeController) CreateStoreType(c *gin.Context) {
	var req dto.StoreTypeCreateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.storeTypeService.CreateStoreType(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo loại cửa hàng thành công", response)
}

// UpdateStoreType updates an existing store type
func (ctrl *StoreTypeController) UpdateStoreType(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.StoreTypeUpdateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.storeTypeService.UpdateStoreType(uint(id), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật loại cửa hàng thành công", response)
}

// DeleteStoreType deletes a store type by ID
func (ctrl *StoreTypeController) DeleteStoreType(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	// Call service
	err = ctrl.storeTypeService.DeleteStoreType(uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa loại cửa hàng thành công", nil)
}
