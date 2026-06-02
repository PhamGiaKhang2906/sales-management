package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type CustomerRepository struct {
	DB *gorm.DB
}

// NewCustomerRepository creates a new customer repository
func NewCustomerRepository(db *gorm.DB) *CustomerRepository {
	return &CustomerRepository{DB: db}
}

// GetAllCustomers retrieves all customers
func (r *CustomerRepository) GetAllCustomers() ([]models.Customer, error) {
	var customers []models.Customer
	result := r.DB.Order("id DESC").Find(&customers)
	return customers, result.Error
}

// GetCustomerByID retrieves a customer by ID
func (r *CustomerRepository) GetCustomerByID(id uint) (*models.Customer, error) {
	var customer models.Customer
	result := r.DB.First(&customer, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &customer, nil
}

// CheckCustomerCodeExists checks if customer code already exists
func (r *CustomerRepository) CheckCustomerCodeExists(code string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Customer{}).Where("code = ?", code).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckCustomerCodeExistsExcept checks if customer code exists excluding a specific ID
func (r *CustomerRepository) CheckCustomerCodeExistsExcept(code string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Customer{}).Where("code = ? AND id != ?", code, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckCustomerPhoneExists checks if customer phone already exists
func (r *CustomerRepository) CheckCustomerPhoneExists(phone string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Customer{}).Where("phone = ?", phone).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckCustomerPhoneExistsExcept checks if customer phone exists excluding a specific ID
func (r *CustomerRepository) CheckCustomerPhoneExistsExcept(phone string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Customer{}).Where("phone = ? AND id != ?", phone, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateCustomer creates a new customer
func (r *CustomerRepository) CreateCustomer(customer *models.Customer) error {
	return r.DB.Create(customer).Error
}

// UpdateCustomer updates an existing customer
func (r *CustomerRepository) UpdateCustomer(customer *models.Customer) error {
	return r.DB.Save(customer).Error
}

// DeleteCustomer deletes a customer by ID
func (r *CustomerRepository) DeleteCustomer(id uint) error {
	return r.DB.Delete(&models.Customer{}, id).Error
}
