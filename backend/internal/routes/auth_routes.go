package routes

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/controllers"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRoutes(r *gin.RouterGroup, db *gorm.DB) {
	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	storeRepo := repository.NewStoreRepository(db)
	roleRepo := repository.NewRoleRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, storeRepo, roleRepo)

	// Initialize controllers
	authCtrl := controllers.NewAuthController(authService)

	// Auth routes group
	auth := r.Group("/auth")
	{
		// Public routes
		auth.POST("/register", authCtrl.Register)
		// auth.POST("/login", authCtrl.Login)          // Future
		// auth.POST("/logout", authCtrl.Logout)        // Future
		// auth.POST("/refresh-token", authCtrl.Refresh) // Future
	}
}
