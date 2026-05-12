package initializers

import (
	"fmt"
	"log"
	"os"

	"github.com/PhamGiaKhang2906/sales-management-backend/pkg/database"

	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	DB, err = database.NewGormConnection(dsn)
	if err != nil {
		log.Fatal("Failed to connect to database!")
	}
}
