package controllers

import (
	"net/http"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type StoreController struct {
	storeService *services.StoreService
}

// NewStoreController creates a new store controller.
func NewStoreController(storeService *services.StoreService) *StoreController {
	return &StoreController{storeService: storeService}
}

// GetMyStore returns the store information of the authenticated owner.
func (ctrl *StoreController) GetMyStore(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin người dùng")
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin người dùng không hợp lệ")
		return
	}

	response, err := ctrl.storeService.GetStoreByOwnerUserID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin cửa hàng thành công", response)
}

// UpdateMyStore updates the store information of the authenticated owner.
func (ctrl *StoreController) UpdateMyStore(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin người dùng")
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin người dùng không hợp lệ")
		return
	}

	var req dto.OwnerStoreUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	response, err := ctrl.storeService.UpdateStoreByOwnerUserID(userID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật thông tin cửa hàng thành công", response)
}
