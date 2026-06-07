package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type PurchaseOrderController struct {
	poService *services.PurchaseOrderService
}

func NewPurchaseOrderController(poService *services.PurchaseOrderService) *PurchaseOrderController {
	return &PurchaseOrderController{poService: poService}
}

func (ctrl *PurchaseOrderController) getCurrentUserID(c *gin.Context) (uint, bool) {
	value, exists := c.Get("userID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin người dùng")
		return 0, false
	}
	userID, ok := value.(uint)
	if !ok {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin người dùng không hợp lệ")
		return 0, false
	}
	return userID, true
}

func (ctrl *PurchaseOrderController) getStoreID(c *gin.Context) (uint, bool) {
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

func (ctrl *PurchaseOrderController) GetAll(c *gin.Context) {
	storeID, ok := ctrl.getStoreID(c)
	if !ok {
		return
	}
	res, err := ctrl.poService.GetAllPurchaseOrders(storeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách phiếu nhập thành công", res)
}

func (ctrl *PurchaseOrderController) Get(c *gin.Context) {
	storeID, ok := ctrl.getStoreID(c)
	if !ok {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}
	res, err := ctrl.poService.GetPurchaseOrderByID(storeID, uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin phiếu nhập thành công", res)
}

func (ctrl *PurchaseOrderController) Create(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}
	storeID, ok := ctrl.getStoreID(c)
	if !ok {
		return
	}
	var req dto.PurchaseOrderCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}
	req.StoreID = storeID
	res, err := ctrl.poService.CreatePurchaseOrder(userID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusCreated, "Tạo phiếu nhập thành công", res)
}

func (ctrl *PurchaseOrderController) Return(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}
	storeID, ok2 := ctrl.getStoreID(c)
	if !ok2 {
		return
	}
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}
	res, err := ctrl.poService.ReturnPurchaseOrder(userID, storeID, uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Trả phiếu nhập thành công", res)
}
