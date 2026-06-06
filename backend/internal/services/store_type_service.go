package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type StoreTypeService struct {
	storeTypeRepo *repository.StoreTypeRepository
}

// NewStoreTypeService creates a new store type service
func NewStoreTypeService(storeTypeRepo *repository.StoreTypeRepository) *StoreTypeService {
	return &StoreTypeService{
		storeTypeRepo: storeTypeRepo,
	}
}

// GetAllStoreTypes retrieves all store types
func (s *StoreTypeService) GetAllStoreTypes() (*dto.StoreTypesListResponse, error) {
	storeTypes, err := s.storeTypeRepo.GetAllStoreTypes()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách loại cửa hàng")
	}

	totalStores, popularTypeName, err := s.storeTypeRepo.GetStoreStatistics()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thống kê cửa hàng")
	}

	// Convert to response
	var responses []dto.StoreTypeResponse
	for _, st := range storeTypes {
		responses = append(responses, dto.StoreTypeResponse{
			ID:   st.ID,
			Name: st.Name,
		})
	}

	return &dto.StoreTypesListResponse{
		StoreTypes:      responses,
		Total:           len(responses),
		TotalStores:     totalStores,
		MostPopularType: popularTypeName,
	}, nil
}

// CreateStoreType creates a new store type
func (s *StoreTypeService) CreateStoreType(req *dto.StoreTypeCreateRequest) (*dto.StoreTypeResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên loại cửa hàng không được để trống")
	}

	// Check if name already exists
	exists, err := s.storeTypeRepo.CheckStoreTypeNameExists(req.Name)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên loại cửa hàng")
	}
	if exists {
		return nil, errors.New("Tên loại cửa hàng đã tồn tại")
	}

	// Create store type
	storeType := &models.StoreType{
		Name: req.Name,
	}

	if err := s.storeTypeRepo.CreateStoreType(storeType); err != nil {
		return nil, errors.New("Lỗi khi tạo loại cửa hàng")
	}

	response := &dto.StoreTypeResponse{
		ID:   storeType.ID,
		Name: storeType.Name,
	}

	return response, nil
}

// UpdateStoreType updates an existing store type
func (s *StoreTypeService) UpdateStoreType(id uint, req *dto.StoreTypeUpdateRequest) (*dto.StoreTypeResponse, error) {
	// Validate name not empty
	if req.Name == "" {
		return nil, errors.New("Tên loại cửa hàng không được để trống")
	}

	// Check if store type exists
	storeType, err := s.storeTypeRepo.GetStoreTypeByID(id)
	if err != nil {
		return nil, errors.New("Loại cửa hàng không tồn tại")
	}

	// Check if new name already exists (excluding current ID)
	exists, err := s.storeTypeRepo.CheckStoreTypeNameExistsExcept(req.Name, id)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên loại cửa hàng")
	}
	if exists {
		return nil, errors.New("Tên loại cửa hàng đã tồn tại")
	}

	// Update store type
	storeType.Name = req.Name
	if err := s.storeTypeRepo.UpdateStoreType(storeType); err != nil {
		return nil, errors.New("Lỗi khi cập nhật loại cửa hàng")
	}

	response := &dto.StoreTypeResponse{
		ID:   storeType.ID,
		Name: storeType.Name,
	}

	return response, nil
}

// DeleteStoreType deletes a store type by ID
func (s *StoreTypeService) DeleteStoreType(id uint) error {
	// Check if store type exists
	_, err := s.storeTypeRepo.GetStoreTypeByID(id)
	if err != nil {
		return errors.New("Loại cửa hàng không tồn tại")
	}

	// Delete store type
	if err := s.storeTypeRepo.DeleteStoreType(id); err != nil {
		return errors.New("Lỗi khi xóa loại cửa hàng")
	}

	return nil
}
