package database

import (
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// NewGormConnection is a shared utility function to initialize a GORM database connection.
// This can be easily reused across different projects.
func NewGormConnection(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Configure Connection Pool (Performance Optimization)
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)           // Maximum number of connections in the idle connection pool
	sqlDB.SetMaxOpenConns(100)          // Maximum number of open connections to the database
	sqlDB.SetConnMaxLifetime(time.Hour) // Maximum amount of time a connection may be reused

	return db, nil
}
