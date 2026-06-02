package middleware

import (
	"net/http"

	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// OwnerOnlyMiddleware allows only users with the owner role to access a route group.
func OwnerOnlyMiddleware(db *gorm.DB) gin.HandlerFunc {
	roleRepo := repository.NewRoleRepository(db)
	ownerRole, err := roleRepo.GetRoleByName("owner")
	if err != nil {
		return func(c *gin.Context) {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Vai trò owner không tồn tại")
			c.Abort()
		}
	}

	ownerRoleID := ownerRole.ID

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

		if roleID != ownerRoleID {
			utils.ErrorResponse(c, http.StatusForbidden, "Bạn không có quyền truy cập chức năng này")
			c.Abort()
			return
		}

		c.Next()
	}
}
