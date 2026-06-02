package services

import (
	"errors"

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
func (s *CategoryService) GetAllCategories() (*dto.CategoriesListResponse, error) {
	categories, err := s.categoryRepo.GetAllCategories()
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
func (s *CategoryService) CreateCategory(req *dto.CategoryCreateRequest) (*dto.CategoryResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên danh mục không được để trống")
	}

	// Check if name already exists
	exists, err := s.categoryRepo.CheckCategoryNameExists(req.Name)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên danh mục")
	}
	if exists {
		return nil, errors.New("Tên danh mục đã tồn tại")
	}

	// Create category
	category := &models.Category{
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
func (s *CategoryService) UpdateCategory(id uint, req *dto.CategoryUpdateRequest) (*dto.CategoryResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên danh mục không được để trống")
	}

	// Check if category exists
	category, err := s.categoryRepo.GetCategoryByID(id)
	if err != nil {
		return nil, errors.New("Danh mục không tồn tại")
	}

	// Check if new name already exists (excluding current ID)
	exists, err := s.categoryRepo.CheckCategoryNameExistsExcept(req.Name, id)
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

// DeleteCategory deletes a category by ID
func (s *CategoryService) DeleteCategory(id uint) error {
	// Check if category exists
	_, err := s.categoryRepo.GetCategoryByID(id)
	if err != nil {
		return errors.New("Danh mục không tồn tại")
	}

	// Delete category
	if err := s.categoryRepo.DeleteCategory(id); err != nil {
		return errors.New("Lỗi khi xóa danh mục")
	}

	return nil
}
