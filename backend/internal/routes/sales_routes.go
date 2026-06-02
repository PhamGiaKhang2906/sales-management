package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SalesRoutes(r *gin.RouterGroup, db *gorm.DB) {
	sales := r.Group("/sales")
	sales.Use(middleware.SalesOnlyMiddleware(db))
	{
		CustomerRoutes(sales, db)
	}
}
