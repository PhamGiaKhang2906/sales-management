package services

import (
	"errors"
	"fmt"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type CategoryService struct {
	categoryRepo *repository.CategoryRepository
}

// NewCategoryService creates a new category service
func NewCategoryService(categoryRepo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{
		categoryRepo: categoryRepo,
	}
}

// GetAllCategories retrieves all categories
func (s *CategoryService) GetAllCategories(storeID uint) (*dto.CategoriesListResponse, error) {
	categories, err := s.categoryRepo.GetAllCategoriesByStore(storeID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách danh mục")
	}

	// Convert to response
	var responses []dto.CategoryResponse
	for _, cat := range categories {
		responses = append(responses, dto.CategoryResponse{
			ID:   cat.ID,
			Name: cat.Name,
		})
	}

	return &dto.CategoriesListResponse{
		Categories: responses,
		Total:      len(responses),
	}, nil
}

// CreateCategory creates a new category
func (s *CategoryService) CreateCategory(storeID uint, req *dto.CategoryCreateRequest) (*dto.CategoryResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên danh mục không được để trống")
	}

	// Check if name already exists
	exists, err := s.categoryRepo.CheckCategoryNameExists(req.Name, storeID)
	if err != nil {
		// print debug info to server console
		fmt.Printf("[DEBUG] CreateCategory: CheckCategoryNameExists error: name=%s storeID=%d err=%v\n", req.Name, storeID, err)
		return nil, errors.New("Lỗi khi kiểm tra tên danh mục")
	}
	if exists {
		return nil, errors.New("Tên danh mục đã tồn tại")
	}

	// Create category
	category := &models.Category{
		StoreID: storeID,
		Name: req.Name,
	}

	if err := s.categoryRepo.CreateCategory(category); err != nil {
		return nil, errors.New("Lỗi khi tạo danh mục")
	}

	response := &dto.CategoryResponse{
		ID:   category.ID,
		Name: category.Name,
	}

	return response, nil
}

// UpdateCategory updates an existing category
func (s *CategoryService) UpdateCategory(id uint, storeID uint, req *dto.CategoryUpdateRequest) (*dto.CategoryResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên danh mục không được để trống")
	}

	// Check if category exists
	category, err := s.categoryRepo.GetCategoryByIDAndStore(id, storeID)
	if err != nil {
		return nil, errors.New("Danh mục không tồn tại")
	}

	// Check if new name already exists (excluding current ID)
	exists, err := s.categoryRepo.CheckCategoryNameExistsExcept(req.Name, id, storeID)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên danh mục")
	}
	if exists {
		return nil, errors.New("Tên danh mục đã tồn tại")
	}

	// Update category
	category.Name = req.Name

	if err := s.categoryRepo.UpdateCategory(category); err != nil {
		return nil, errors.New("Lỗi khi cập nhật danh mục")
	}

	response := &dto.CategoryResponse{
		ID:   category.ID,
		Name: category.Name,
	}

	return response, nil
}

// GetCategoryByID retrieves a category by ID and storeID
func (s *CategoryService) GetCategoryByID(id uint, storeID uint) (*dto.CategoryResponse, error) {
	category, err := s.categoryRepo.GetCategoryByIDAndStore(id, storeID)
	if err != nil {
		return nil, errors.New("Danh mục không tồn tại")
	}

	response := &dto.CategoryResponse{
		ID:   category.ID,
		Name: category.Name,
	}

	return response, nil
}

// DeleteCategory deletes a category by ID
func (s *CategoryService) DeleteCategory(id uint, storeID uint) error {
	// Check if category exists before deleting
	_, err := s.categoryRepo.GetCategoryByIDAndStore(id, storeID)
	if err != nil {
		return errors.New("Danh mục không tồn tại")
	}

	if err := s.categoryRepo.DeleteCategory(id, storeID); err != nil {
		return errors.New("Lỗi khi xóa danh mục")
	}
	return nil
}
