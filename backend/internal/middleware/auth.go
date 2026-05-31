package middleware

import (
	"net/http"
	"strings"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks JWT token from Authorization header or cookie
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		// Try to get token from Authorization header first
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			// Extract token from "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				tokenString = parts[1]
			} else {
				utils.ErrorResponse(c, http.StatusUnauthorized, "Token không hợp lệ")
				c.Abort()
				return
			}
		} else {
			// Try to get token from cookie
			var err error
			tokenString, err = c.Cookie("token")
			if err != nil {
				utils.ErrorResponse(c, http.StatusUnauthorized, "Token không tồn tại")
				c.Abort()
				return
			}
		}

		// Verify token
		claims, err := utils.VerifyToken(tokenString)
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Token không hợp lệ hoặc đã hết hạn")
			c.Abort()
			return
		}

		// Store claims in context
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("roleID", claims.RoleID)

		c.Next()
	}
}
