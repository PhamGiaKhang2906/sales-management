package repository

import (
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	DB *gorm.DB
}

// NewCategoryRepository creates a new category repository
func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{DB: db}
}

// GetAllCategories retrieves all categories
func (r *CategoryRepository) GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	result := r.DB.Find(&categories)
	return categories, result.Error
}

// GetCategoryByID retrieves a category by ID
func (r *CategoryRepository) GetCategoryByID(id uint) (*models.Category, error) {
	var category models.Category
	result := r.DB.First(&category, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &category, nil
}

// CheckCategoryNameExists checks if category name already exists
func (r *CategoryRepository) CheckCategoryNameExists(name string) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Category{}).Where("name = ?", name).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CheckCategoryNameExistsExcept checks if name exists excluding a specific ID
func (r *CategoryRepository) CheckCategoryNameExistsExcept(name string, excludeID uint) (bool, error) {
	var count int64
	result := r.DB.Model(&models.Category{}).Where("name = ? AND id != ?", name, excludeID).Count(&count)
	if result.Error != nil {
		return false, result.Error
	}
	return count > 0, nil
}

// CreateCategory creates a new category
func (r *CategoryRepository) CreateCategory(category *models.Category) error {
	return r.DB.Create(category).Error
}

// UpdateCategory updates an existing category
func (r *CategoryRepository) UpdateCategory(category *models.Category) error {
	return r.DB.Model(category).Update("name", category.Name).Error
}

// DeleteCategory deletes a category by ID
func (r *CategoryRepository) DeleteCategory(id uint) error {
	return r.DB.Delete(&models.Category{}, id).Error
}

// GetCategoryCount returns the total count of categories
func (r *CategoryRepository) GetCategoryCount() (int64, error) {
	var count int64
	result := r.DB.Model(&models.Category{}).Count(&count)
	return count, result.Error
}
