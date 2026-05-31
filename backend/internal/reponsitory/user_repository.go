package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// CheckUsernameExists checks if username already exists
func (r *UserRepository) CheckUsernameExists(username string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.User{}).Where("username = ?", username).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckPhoneExists checks if phone already exists
func (r *UserRepository) CheckPhoneExists(phone string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.User{}).Where("phone = ?", phone).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateUser creates a new user in the database
func (r *UserRepository) CreateUser(user *models.User) error {
	return r.DB.Create(user).Error
}

// GetUserByUsername retrieves a user by username
func (r *UserRepository) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := r.DB.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
