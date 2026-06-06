package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	storeRepo *repository.StoreRepository
	roleRepo  *repository.RoleRepository
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo *repository.UserRepository, storeRepo *repository.StoreRepository, roleRepo *repository.RoleRepository) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		storeRepo: storeRepo,
		roleRepo:  roleRepo,
	}
}

// Register handles user registration
func (s *AuthService) Register(req *dto.RegisterRequest) (*dto.RegisterResponse, error) {
	// Validate username
	if valid, msg := utils.ValidateUsername(req.Username); !valid {
		return nil, errors.New(msg)
	}

	// Validate password (min 8 characters excluding whitespace)
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		return nil, errors.New(msg)
	}

	// Validate phone (exactly 10 digits)
	if valid, msg := utils.ValidatePhone(req.Phone); !valid {
		return nil, errors.New(msg)
	}

	// Validate fullname
	if valid, msg := utils.ValidateFullname(req.FullName); !valid {
		return nil, errors.New(msg)
	}

	// Check if username already exists
	exists, err := s.userRepo.CheckUsernameExists(req.Username)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên đăng nhập")
	}
	if exists {
		return nil, errors.New("Tên đăng nhập đã tồn tại")
	}

	// Check if phone already exists in User table
	phoneExistsUser, err := s.userRepo.CheckPhoneExists(req.Phone)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại")
	}
	if phoneExistsUser {
		return nil, errors.New("Số điện thoại đã tồn tại")
	}

	// Check if phone already exists in Store table
	phoneExistsStore, err := s.storeRepo.CheckPhoneExists(req.Phone)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại cửa hàng")
	}
	if phoneExistsStore {
		return nil, errors.New("Số điện thoại cửa hàng đã tồn tại")
	}

	// Get store type by name
	storeType, err := s.storeRepo.GetStoreTypeByName(req.StoreType)
	if err != nil {
		return nil, errors.New("Loại cửa hàng không tồn tại")
	}

	// Get default role (customer)
	role, err := s.roleRepo.GetDefaultRole()
	if err != nil {
		return nil, errors.New("Vai trò mặc định không tồn tại. Vui lòng liên hệ quản trị viên")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("Lỗi khi xử lý mật khẩu")
	}

	// Create store first
	store := &models.Store{
		Name:        req.Username,
		Phone:       req.Phone,
		StoreTypeID: storeType.ID,
		Address:     req.Address,
	}

	if err := s.storeRepo.CreateStore(store); err != nil {
		return nil, errors.New("Lỗi khi tạo cửa hàng")
	}

	// Create user
	user := &models.User{
		Username: req.Username,
		Password: hashedPassword,
		FullName: req.FullName,
		Phone:    req.Phone,
		RoleID:   role.ID,
		StoreID:  &store.ID,
		Status:   "Chờ_duyệt",
	}

	if err := s.userRepo.CreateUser(user); err != nil {
		return nil, errors.New("Lỗi khi tạo tài khoản người dùng")
	}

	response := &dto.RegisterResponse{
		UserID:  user.ID,
		StoreID: store.ID,
		Message: "Đăng ký thành công",
	}

	return response, nil
}

// Login handles user login
func (s *AuthService) Login(req *dto.LoginRequest) (*dto.LoginResponse, error) {
	// Validate input
	if req.Username == "" {
		return nil, errors.New("Tên đăng nhập không được để trống")
	}

	if req.Password == "" {
		return nil, errors.New("Mật khẩu không được để trống")
	}

	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}

	// Get user by username
	user, err := s.userRepo.GetUserByUsername(req.Username)
	if err != nil {
		return nil, errors.New("Tên đăng nhập hoặc mật khẩu không đúng")
	}

	// Check if phone matches
	if user.Phone != req.Phone {
		return nil, errors.New("Tên đăng nhập hoặc số điện thoại không đúng")
	}

	// Check if account is active
	if user.Status != "Đã_duyệt" {
		return nil, errors.New("Tài khoản đã bị khóa hoặc không hoạt động")
	}

	// Check password
	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("Tên đăng nhập hoặc mật khẩu không đúng")
	}

	// Return success response
	storeID := uint(0)
	if user.StoreID != nil {
		storeID = *user.StoreID
	}
	response := &dto.LoginResponse{
		UserID:   user.ID,
		Username: user.Username,
		RoleID:   user.RoleID,
		StoreID:  storeID,
		Message:  "Đăng nhập thành công",
	}

	return response, nil
}
