package controllers

import (
	"net/http"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AdminAccountController struct {
	adminAccountService *services.AdminAccountService
}

// NewAdminAccountController creates a new admin account controller
func NewAdminAccountController(adminAccountService *services.AdminAccountService) *AdminAccountController {
	return &AdminAccountController{
		adminAccountService: adminAccountService,
	}
}

// GetAccounts retrieves all accounts with statistics
func (ctrl *AdminAccountController) GetAccounts(c *gin.Context) {
	response, err := ctrl.adminAccountService.GetAccountsWithStats()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách tài khoản thành công", response)
}

// ChangeAccountStatus changes the status of an account
func (ctrl *AdminAccountController) ChangeAccountStatus(c *gin.Context) {
	var req dto.ChangeAccountStatusRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service
	response, err := ctrl.adminAccountService.ChangeAccountStatus(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật trạng thái thành công", response)
}
