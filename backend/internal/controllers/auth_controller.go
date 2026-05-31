package controllers

import (
	"net/http"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *services.AuthService
}

// NewAuthController creates a new auth controller
func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{
		authService: authService,
	}
}

// Register handles the user registration request
func (ctrl *AuthController) Register(c *gin.Context) {
	var req dto.RegisterRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service to handle registration
	response, err := ctrl.authService.Register(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// Send success response with token
	data := map[string]interface{}{
		"user_id":  response.UserID,
		"store_id": response.StoreID,
	}

	utils.SuccessResponse(c, http.StatusCreated, "Đăng ký thành công", data)
}
