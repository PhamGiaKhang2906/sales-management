package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type StoreService struct {
	storeRepo *repository.StoreRepository
	userRepo  *repository.UserRepository
}

// NewStoreService creates a new store service.
func NewStoreService(storeRepo *repository.StoreRepository, userRepo *repository.UserRepository) *StoreService {
	return &StoreService{storeRepo: storeRepo, userRepo: userRepo}
}

// GetStoreByOwnerUserID gets store information by owner user ID.
func (s *StoreService) GetStoreByOwnerUserID(userID uint) (*dto.OwnerStoreResponse, error) {
	user, err := s.userRepo.GetUserByID(userID)
	if err != nil {
		return nil, errors.New("Người dùng không tồn tại")
	}

	if user.StoreID == nil {
		return nil, errors.New("Người dùng chưa có cửa hàng")
	}

	store, err := s.storeRepo.GetStoreByID(*user.StoreID)
	if err != nil {
		return nil, errors.New("Cửa hàng không tồn tại")
	}

	response := dto.OwnerStoreResponse{
		ID:          store.ID,
		Name:        store.Name,
		Address:     store.Address,
		Phone:       store.Phone,
		StoreTypeID: store.StoreTypeID,
	}
	if store.StoreType != nil {
		response.StoreTypeName = store.StoreType.Name
	}

	return &response, nil
}

// UpdateStoreByOwnerUserID updates store information by owner user ID.
func (s *StoreService) UpdateStoreByOwnerUserID(userID uint, req *dto.OwnerStoreUpdateRequest) (*dto.OwnerStoreResponse, error) {
	if req.Name == "" {
		return nil, errors.New("Tên cửa hàng không được để trống")
	}
	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}

	user, err := s.userRepo.GetUserByID(userID)
	if err != nil {
		return nil, errors.New("Người dùng không tồn tại")
	}

	if user.StoreID == nil {
		return nil, errors.New("Người dùng chưa có cửa hàng")
	}

	store, err := s.storeRepo.GetStoreByID(*user.StoreID)
	if err != nil {
		return nil, errors.New("Cửa hàng không tồn tại")
	}

	phoneExists, err := s.storeRepo.CheckPhoneExistsExcept(req.Phone, store.ID)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại cửa hàng")
	}
	if phoneExists {
		return nil, errors.New("Số điện thoại cửa hàng đã tồn tại")
	}

	store.Name = req.Name
	store.Address = req.Address
	store.Phone = req.Phone

	if err := s.storeRepo.UpdateStore(store); err != nil {
		return nil, errors.New("Lỗi khi cập nhật cửa hàng")
	}

	updatedStore, err := s.storeRepo.GetStoreByID(store.ID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin cửa hàng sau cập nhật")
	}

	response := dto.OwnerStoreResponse{
		ID:          updatedStore.ID,
		Name:        updatedStore.Name,
		Address:     updatedStore.Address,
		Phone:       updatedStore.Phone,
		StoreTypeID: updatedStore.StoreTypeID,
	}
	if updatedStore.StoreType != nil {
		response.StoreTypeName = updatedStore.StoreType.Name
	}

	return &response, nil
}
