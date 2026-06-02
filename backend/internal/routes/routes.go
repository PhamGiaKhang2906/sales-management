package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// Public API routes (no authentication required)
	publicAPI := r.Group("/api")
	{
		// Authentication routes (register, login, etc.)
		AuthRoutes(publicAPI, db)
	}

	// Protected API routes (authentication required)
	protectedAPI := r.Group("/api")
	protectedAPI.Use(middleware.AuthMiddleware())
	{
		// Admin routes (account management, statistics)
		AdminRoutes(protectedAPI, db)

		// Owner routes (suppliers, categories)
		OwnerRoutes(protectedAPI, db)

		// User routes (profile, etc.)
		// UserRoutes(protectedAPI, db)

		// Store routes (CRUD operations)
		// StoreRoutes(protectedAPI, db)

		// Product routes (CRUD operations)
		// ProductRoutes(protectedAPI, db)

		// Order routes (CRUD operations)
		// OrderRoutes(protectedAPI, db)
	}
}
