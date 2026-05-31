package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type RoleRepository struct {
	DB *gorm.DB
}

// NewRoleRepository creates a new role repository
func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{DB: db}
}

// GetRoleByName retrieves a role by name
func (r *RoleRepository) GetRoleByName(name string) (*models.Role, error) {
	var role models.Role
	result := r.DB.Where("role_name = ?", name).First(&role)
	if result.Error != nil {
		return nil, result.Error
	}
	return &role, nil
}

// GetDefaultRole retrieves the default role (usually customer)
func (r *RoleRepository) GetDefaultRole() (*models.Role, error) {
	var role models.Role
	result := r.DB.Where("role_name = ?", "customer").First(&role)
	if result.Error != nil {
		return nil, result.Error
	}
	return &role, nil
}
