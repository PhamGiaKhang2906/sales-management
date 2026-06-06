package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CheckUsernameExists(username string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.User{}).Where("username = ?", username).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

func (r *UserRepository) CheckPhoneExists(phone string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.User{}).Where("phone = ?", phone).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

func (r *UserRepository) CreateUser(user *models.User) error {
	return r.DB.Create(user).Error
}

func (r *UserRepository) GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := r.DB.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func (r *UserRepository) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	result := r.DB.First(&user, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

// GetAllAccounts retrieves all users with their store and store type information
func (r *UserRepository) GetAllAccounts() ([]map[string]interface{}, error) {
	var accounts []map[string]interface{}
	// BỔ SUNG stores.address VÀO SELECT
	result := r.DB.Model(&models.User{}).
		Select("users.id as user_id, users.full_name as fullname, users.phone, users.username as store_name, store_types.name as category, users.status, stores.address").
		Joins("LEFT JOIN stores ON users.store_id = stores.id").
		Joins("LEFT JOIN store_types ON stores.store_type_id = store_types.id").
		Scan(&accounts)

	if result.Error != nil {
		return nil, result.Error
	}
	return accounts, nil
}

func (r *UserRepository) CountAccountsByStatus() (map[string]int, error) {
	type StatusCount struct {
		Status string
		Count  int64
	}

	var results []StatusCount
	statusMap := map[string]int{
		"Chờ duyệt": 0,
		"Đã duyệt":  0,
		"Từ chối":   0,
	}

	result := r.DB.Model(&models.User{}).
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&results)

	if result.Error != nil {
		return nil, result.Error
	}

	for _, sc := range results {
		statusMap[sc.Status] = int(sc.Count)
	}

	return statusMap, nil
}

func (r *UserRepository) GetTotalAccountsCount() (int64, error) {
	var count int64
	result := r.DB.Model(&models.User{}).Count(&count)
	return count, result.Error
}

func (r *UserRepository) UpdateUserStatus(userID uint, status string) error {
	return r.DB.Model(&models.User{}).Where("id = ?", userID).Update("status", status).Error
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	return r.DB.Model(user).Updates(user).Error
}

func (r *UserRepository) DeleteUser(userID uint) error {
	return r.DB.Delete(&models.User{}, userID).Error
}
