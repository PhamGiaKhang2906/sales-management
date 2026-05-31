package main

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/initializers"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/routes"
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

	// Setup API routes
	routes.SetupRoutes(r, initializers.DB)

	r.Run(":8080")
}
