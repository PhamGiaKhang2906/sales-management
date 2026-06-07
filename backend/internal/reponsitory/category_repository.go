package repository

import (
	"fmt"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	DB *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{DB: db}
}

// GetAllCategoriesByStore: Chỉ lấy danh mục thuộc cửa hàng đó
func (r *CategoryRepository) GetAllCategoriesByStore(storeID uint) ([]models.Category, error) {
	var categories []models.Category
	// Include global categories (store_id = 0) as fallback/shared categories
	result := r.DB.Where("store_id = ? OR store_id = 0", storeID).Find(&categories)
	return categories, result.Error
}

func (r *CategoryRepository) GetCategoryByIDAndStore(id uint, storeID uint) (*models.Category, error) {
	var category models.Category
	result := r.DB.Where("id = ? AND store_id = ?", id, storeID).First(&category)
	return &category, result.Error
}

func (r *CategoryRepository) CheckCategoryNameExists(name string, storeID uint) (bool, error) {
	var count int64
	// Check within the store and global categories
	result := r.DB.Model(&models.Category{}).Where("name = ? AND (store_id = ? OR store_id = 0)", name, storeID).Count(&count)
	if result.Error != nil {
		// log the SQL error for debugging
		// use Printf to ensure it appears in server stdout
		fmt.Printf("[DEBUG] CheckCategoryNameExists error: name=%s storeID=%d err=%v\n", name, storeID, result.Error)
	}
	return count > 0, result.Error
}

func (r *CategoryRepository) CheckCategoryNameExistsExcept(name string, id uint, storeID uint) (bool, error) {
	var count int64
	// Exclude the given ID and check within the store and global categories
	result := r.DB.Model(&models.Category{}).Where("name = ? AND id <> ? AND (store_id = ? OR store_id = 0)", name, id, storeID).Count(&count)
	return count > 0, result.Error
}

func (r *CategoryRepository) CreateCategory(category *models.Category) error {
	return r.DB.Create(category).Error
}

func (r *CategoryRepository) UpdateCategory(category *models.Category) error {
	return r.DB.Model(category).Update("name", category.Name).Error
}

func (r *CategoryRepository) DeleteCategory(id uint, storeID uint) error {
	return r.DB.Where("id = ? AND store_id = ?", id, storeID).Delete(&models.Category{}).Error
}
