package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type EmployeeRepository struct {
	DB *gorm.DB
}

// NewEmployeeRepository creates a new employee repository
func NewEmployeeRepository(db *gorm.DB) *EmployeeRepository {
	return &EmployeeRepository{DB: db}
}

// GetAllEmployeesByStore retrieves all employees for a specific store
func (r *EmployeeRepository) GetAllEmployeesByStore(storeID uint) ([]models.Employee, error) {
	var employees []models.Employee
	result := r.DB.Joins("JOIN users ON employees.user_id = users.id").
		Where("users.store_id = ?", storeID).
		Preload("User").
		Find(&employees)
	return employees, result.Error
}

// GetEmployeeByID retrieves an employee by ID
func (r *EmployeeRepository) GetEmployeeByID(id uint) (*models.Employee, error) {
	var employee models.Employee
	result := r.DB.Preload("User").First(&employee, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &employee, nil
}

// GetEmployeeByIDAndStore retrieves an employee by ID and verifies store ownership
func (r *EmployeeRepository) GetEmployeeByIDAndStore(id uint, storeID uint) (*models.Employee, error) {
	var employee models.Employee
	result := r.DB.Joins("JOIN users ON employees.user_id = users.id").
		Where("employees.id = ? AND users.store_id = ?", id, storeID).
		Preload("User").
		First(&employee)
	if result.Error != nil {
		return nil, result.Error
	}
	return &employee, nil
}

// GetEmployeeByUserID retrieves an employee by user ID
func (r *EmployeeRepository) GetEmployeeByUserID(userID uint) (*models.Employee, error) {
	var employee models.Employee
	result := r.DB.Preload("User").Where("user_id = ?", userID).First(&employee)
	if result.Error != nil {
		return nil, result.Error
	}
	return &employee, nil
}

// CreateEmployee creates a new employee
func (r *EmployeeRepository) CreateEmployee(employee *models.Employee) error {
	return r.DB.Create(employee).Error
}

// UpdateEmployee updates an existing employee
func (r *EmployeeRepository) UpdateEmployee(employee *models.Employee) error {
	return r.DB.Model(employee).Updates(employee).Error
}

// DeleteEmployee deletes an employee by ID
func (r *EmployeeRepository) DeleteEmployee(id uint) error {
	return r.DB.Delete(&models.Employee{}, id).Error
}

// GetEmployeeCountByStore returns the count of employees for a store
func (r *EmployeeRepository) GetEmployeeCountByStore(storeID uint) (int64, error) {
	var count int64
	result := r.DB.Joins("JOIN users ON employees.user_id = users.id").
		Where("users.store_id = ?", storeID).
		Model(&models.Employee{}).
		Count(&count)
	return count, result.Error
}
