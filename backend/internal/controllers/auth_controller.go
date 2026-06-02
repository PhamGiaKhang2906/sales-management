package controllers

import (
	"net/http"
	"os"
	"strconv"

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

// Login handles the user login request
func (ctrl *AuthController) Login(c *gin.Context) {
	var req dto.LoginRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Call service to handle login
	response, err := ctrl.authService.Login(&req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(response.UserID, response.Username, response.RoleID, response.StoreID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Lỗi khi tạo token")
		return
	}

	// Get cookie expiration time (default 24 hours)
	cookieExpire := 24
	if envCookieExpire := os.Getenv("COOKIE_EXPIRE"); envCookieExpire != "" {
		if val, err := strconv.Atoi(envCookieExpire); err == nil {
			cookieExpire = val
		}
	}

	// Set JWT token to cookie
	c.SetCookie(
		"token",            // Cookie name
		token,              // Cookie value
		cookieExpire*60*60, // Max age (in seconds)
		"/",                // Path
		"",                 // Domain
		false,              // Secure (set to true in production with HTTPS)
		true,               // HttpOnly
	)

	// Send success response
	data := map[string]interface{}{
		"user_id":  response.UserID,
		"username": response.Username,
	}

	utils.SuccessResponse(c, http.StatusOK, "Đăng nhập thành công", data)
}
