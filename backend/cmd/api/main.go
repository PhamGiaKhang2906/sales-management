package main

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/initializers"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hệ thống bán hàng sẵn sàng!"})
	})
	r.Run(":8080")
}
