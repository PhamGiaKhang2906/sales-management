package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type OrderController struct {
	orderService *services.OrderService
}

// NewOrderController creates a new order controller.
func NewOrderController(orderService *services.OrderService) *OrderController {
	return &OrderController{orderService: orderService}
}

func (ctrl *OrderController) getCurrentUserID(c *gin.Context) (uint, bool) {
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

// GetAllOrders retrieves all orders of the authenticated sales user.
func (ctrl *OrderController) GetAllOrders(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	response, err := ctrl.orderService.GetAllOrders(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách đơn hàng thành công", response)
}

// GetOrder retrieves an order by ID.
func (ctrl *OrderController) GetOrder(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	response, err := ctrl.orderService.GetOrderByID(userID, uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy thông tin đơn hàng thành công", response)
}

// CreateOrder creates a new order.
func (ctrl *OrderController) CreateOrder(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	var req dto.OrderCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	response, err := ctrl.orderService.CreateOrder(userID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo đơn hàng thành công", response)
}

// UpdateOrder updates an existing order.
func (ctrl *OrderController) UpdateOrder(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.OrderUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	response, err := ctrl.orderService.UpdateOrder(userID, uint(id), &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật đơn hàng thành công", response)
}

// DeleteOrder deletes an existing order.
func (ctrl *OrderController) DeleteOrder(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	if err := ctrl.orderService.DeleteOrder(userID, uint(id)); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa đơn hàng thành công", nil)
}

// ReturnOrder changes an order from Đã_bán to Đã_trả.
func (ctrl *OrderController) ReturnOrder(c *gin.Context) {
	userID, ok := ctrl.getCurrentUserID(c)
	if !ok {
		return
	}

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	response, err := ctrl.orderService.ReturnOrder(userID, uint(id))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật trạng thái đơn hàng thành công", response)
}
