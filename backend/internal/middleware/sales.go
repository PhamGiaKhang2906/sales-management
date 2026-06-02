package middleware

import (
	"net/http"

	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SalesOnlyMiddleware allows only users with the sales or employee role to access a route group.
func SalesOnlyMiddleware(db *gorm.DB) gin.HandlerFunc {
	roleRepo := repository.NewRoleRepository(db)
	role, err := roleRepo.GetRoleByName("sales")
	if err != nil {
		role, err = roleRepo.GetRoleByName("employee")
		if err != nil {
			return func(c *gin.Context) {
				utils.ErrorResponse(c, http.StatusInternalServerError, "Vai trò sales không tồn tại")
				c.Abort()
			}
		}
	}

	allowedRoleID := role.ID

	return func(c *gin.Context) {
		roleValue, exists := c.Get("roleID")
		if !exists {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin quyền truy cập")
			c.Abort()
			return
		}

		roleID, ok := roleValue.(uint)
		if !ok {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin quyền truy cập không hợp lệ")
			c.Abort()
			return
		}

		if roleID != allowedRoleID {
			utils.ErrorResponse(c, http.StatusForbidden, "Bạn không có quyền truy cập chức năng này")
			c.Abort()
			return
		}

		c.Next()
	}
}
