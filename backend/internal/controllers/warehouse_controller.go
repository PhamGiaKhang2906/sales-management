package controllers

import (
	"net/http"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type WarehouseController struct {
	service *services.WarehouseService
}

func NewWarehouseController(s *services.WarehouseService) *WarehouseController {
	return &WarehouseController{service: s}
}

func (ctrl *WarehouseController) getStoreID(c *gin.Context) (uint, bool) {
	value, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return 0, false
	}
	switch v := value.(type) {
	case uint:
		return v, true
	case int:
		return uint(v), true
	case float64:
		return uint(v), true
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return 0, false
	}
}

func (ctrl *WarehouseController) Dashboard(c *gin.Context) {
	storeID, ok := ctrl.getStoreID(c)
	if !ok {
		return
	}
	res, err := ctrl.service.GetDashboard(storeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin dashboard thành công", res)
}
