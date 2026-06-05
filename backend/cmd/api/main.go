package main

import (
	"time" // Import time for CORS configuration

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/initializers"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/routes"
	"github.com/gin-contrib/cors" // Import gin-contrib/cors
	"github.com/gin-gonic/gin"
)

func init() {
	// Load environment variables
	initializers.LoadEnv()

	// Connect to the database
	initializers.ConnectDB()

	// Sync database schema
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	// Configure CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Allow your Next.js frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup API routes
	routes.SetupRoutes(r, initializers.DB)

	r.Run(":8080")
}
