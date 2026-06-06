package services

import (
	"errors"
	"time"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
)

type EmployeeService struct {
	employeeRepo *repository.EmployeeRepository
	userRepo     *repository.UserRepository
	roleRepo     *repository.RoleRepository
}

// NewEmployeeService creates a new employee service
func NewEmployeeService(
	employeeRepo *repository.EmployeeRepository,
	userRepo *repository.UserRepository,
	roleRepo *repository.RoleRepository,
) *EmployeeService {
	return &EmployeeService{
		employeeRepo: employeeRepo,
		userRepo:     userRepo,
		roleRepo:     roleRepo,
	}
}

// GetAllEmployees retrieves all employees for a store
func (s *EmployeeService) GetAllEmployees(storeID uint) (*dto.EmployeesListResponse, error) {
	employees, err := s.employeeRepo.GetAllEmployeesByStore(storeID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách nhân viên")
	}

	var responses []dto.EmployeeResponse
	for _, emp := range employees {
		birthdayStr := ""
		if emp.Birthday != nil {
			birthdayStr = emp.Birthday.Format("2006-01-02")
		}
		responses = append(responses, dto.EmployeeResponse{
			ID:           emp.ID,
			UserID:       emp.UserID,
			Username:     emp.User.Username,
			Fullname:     emp.User.FullName,
			Phone:        emp.User.Phone,
			CCCD:         emp.CCCD,
			Address:      emp.Address,
			Birthday:     &birthdayStr,
			SalaryFactor: emp.SalaryFactor,
			WorkShift:    emp.WorkShift,
			Status:       emp.User.Status,
			CreatedAt:    emp.User.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return &dto.EmployeesListResponse{
		Employees: responses,
		Total:     len(responses),
	}, nil
}

// CreateEmployee creates a new employee with user account
func (s *EmployeeService) CreateEmployee(storeID uint, req *dto.EmployeeCreateRequest) (*dto.EmployeeResponse, error) {
	// Validate inputs
	if req.Fullname == "" {
		return nil, errors.New("Tên nhân viên không được để trống")
	}
	if req.Username == "" {
		return nil, errors.New("Tên đăng nhập không được để trống")
	}
	if req.Password == "" {
		return nil, errors.New("Mật khẩu không được để trống")
	}
	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}

	// Check if username already exists
	usernameExists, err := s.userRepo.CheckUsernameExists(req.Username)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra tên đăng nhập")
	}
	if usernameExists {
		return nil, errors.New("Tên đăng nhập đã tồn tại")
	}

	// Check if phone already exists
	phoneExists, err := s.userRepo.CheckPhoneExists(req.Phone)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại")
	}
	if phoneExists {
		return nil, errors.New("Số điện thoại đã tồn tại")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("Lỗi khi mã hóa mật khẩu")
	}

	// Get employee role (assumed to have role_name = "sale" or "warehouse")
	role, err := s.roleRepo.GetRoleByName(req.RoleName)
	if err != nil {
		return nil, errors.New("Vai trò nhân viên không hợp lệ hoặc không tồn tại")
	}

	// Create user account
	storeIDPtr := &storeID
	user := &models.User{
		Username: req.Username,
		Password: hashedPassword,
		Phone:    req.Phone,
		FullName: req.Fullname,
		Status:   "Đã_duyệt",
		StoreID:  storeIDPtr,
		RoleID:   role.ID,
	}

	if err := s.userRepo.CreateUser(user); err != nil {
		return nil, errors.New("Lỗi khi tạo tài khoản nhân viên")
	}

	// Parse birthday if provided
	var birthday *time.Time
	if req.Birthday != nil && *req.Birthday != "" {
		parsedTime, err := time.Parse("2006-01-02", *req.Birthday)
		if err != nil {
			return nil, errors.New("Định dạng ngày sinh không hợp lệ (YYYY-MM-DD)")
		}
		birthday = &parsedTime
	}

	// Create employee record
	salaryFactor := 1.00
	if req.SalaryFactor > 0 {
		salaryFactor = req.SalaryFactor
	}

	employee := &models.Employee{
		UserID:       user.ID,
		CCCD:         req.CCCD,
		Address:      req.Address,
		Birthday:     birthday,
		SalaryFactor: salaryFactor,
		WorkShift:    req.WorkShift,
	}

	if err := s.employeeRepo.CreateEmployee(employee); err != nil {
		// Clean up: delete user if employee creation fails
		s.userRepo.DeleteUser(user.ID)
		return nil, errors.New("Lỗi khi tạo hồ sơ nhân viên")
	}

	// Reload employee with user data
	employee, err = s.employeeRepo.GetEmployeeByID(employee.ID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin nhân viên")
	}

	birthdayStr := ""
	if employee.Birthday != nil {
		birthdayStr = employee.Birthday.Format("2006-01-02")
	}

	response := &dto.EmployeeResponse{
		ID:           employee.ID,
		UserID:       employee.UserID,
		Username:     employee.User.Username,
		Fullname:     employee.User.FullName,
		Phone:        employee.User.Phone,
		CCCD:         employee.CCCD,
		Address:      employee.Address,
		Birthday:     &birthdayStr,
		SalaryFactor: employee.SalaryFactor,
		WorkShift:    employee.WorkShift,
		Status:       employee.User.Status,
		CreatedAt:    employee.User.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	return response, nil
}

// UpdateEmployee updates an existing employee
func (s *EmployeeService) UpdateEmployee(id uint, storeID uint, req *dto.EmployeeUpdateRequest) (*dto.EmployeeResponse, error) {
	// Validate inputs
	if req.Fullname == "" {
		return nil, errors.New("Tên nhân viên không được để trống")
	}
	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}

	// Get employee with store ownership check
	employee, err := s.employeeRepo.GetEmployeeByIDAndStore(id, storeID)
	if err != nil {
		return nil, errors.New("Nhân viên không tồn tại")
	}

	// Check if new phone exists (excluding current user)
	var count int64
	err = s.userRepo.DB.Model(&models.User{}).
		Where("phone = ? AND id != ?", req.Phone, employee.UserID).
		Count(&count).Error
	if err == nil && count > 0 {
		return nil, errors.New("Số điện thoại đã được sử dụng bởi tài khoản khác")
	}

	// Parse birthday if provided
	var birthday *time.Time
	if req.Birthday != nil && *req.Birthday != "" {
		parsedTime, err := time.Parse("2006-01-02", *req.Birthday)
		if err != nil {
			return nil, errors.New("Định dạng ngày sinh không hợp lệ (YYYY-MM-DD)")
		}
		birthday = &parsedTime
	}

	// Update user info
	employee.User.FullName = req.Fullname
	employee.User.Phone = req.Phone
	if err := s.userRepo.UpdateUser(employee.User); err != nil {
		return nil, errors.New("Lỗi khi cập nhật thông tin tài khoản")
	}

	// Update employee record
	employee.CCCD = req.CCCD
	employee.Address = req.Address
	employee.Birthday = birthday
	if req.SalaryFactor > 0 {
		employee.SalaryFactor = req.SalaryFactor
	}
	employee.WorkShift = req.WorkShift

	if err := s.employeeRepo.UpdateEmployee(employee); err != nil {
		return nil, errors.New("Lỗi khi cập nhật thông tin nhân viên")
	}

	// Reload to get updated data
	employee, err = s.employeeRepo.GetEmployeeByID(employee.ID)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin nhân viên")
	}

	birthdayStr := ""
	if employee.Birthday != nil {
		birthdayStr = employee.Birthday.Format("2006-01-02")
	}

	response := &dto.EmployeeResponse{
		ID:           employee.ID,
		UserID:       employee.UserID,
		Username:     employee.User.Username,
		Fullname:     employee.User.FullName,
		Phone:        employee.User.Phone,
		CCCD:         employee.CCCD,
		Address:      employee.Address,
		Birthday:     &birthdayStr,
		SalaryFactor: employee.SalaryFactor,
		WorkShift:    employee.WorkShift,
		Status:       employee.User.Status,
		CreatedAt:    employee.User.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	return response, nil
}

// DeleteEmployee deletes an employee (and associated user)
func (s *EmployeeService) DeleteEmployee(id uint, storeID uint) error {
	// Get employee with store ownership check
	employee, err := s.employeeRepo.GetEmployeeByIDAndStore(id, storeID)
	if err != nil {
		return errors.New("Nhân viên không tồn tại")
	}

	// Delete user first (cascade will delete employee)
	if err := s.userRepo.DeleteUser(employee.UserID); err != nil {
		return errors.New("Lỗi khi xóa tài khoản nhân viên")
	}

	return nil
}

// GetEmployee retrieves an employee by ID
func (s *EmployeeService) GetEmployee(id uint) (*dto.EmployeeResponse, error) {
	employee, err := s.employeeRepo.GetEmployeeByID(id)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin nhân viên")
	}

	birthdayStr := ""
	if employee.Birthday != nil {
		birthdayStr = employee.Birthday.Format("2006-01-02")
	}

	response := &dto.EmployeeResponse{
		ID:           employee.ID,
		UserID:       employee.UserID,
		Username:     employee.User.Username,
		Fullname:     employee.User.FullName,
		Phone:        employee.User.Phone,
		CCCD:         employee.CCCD,
		Address:      employee.Address,
		Birthday:     &birthdayStr,
		SalaryFactor: employee.SalaryFactor,
		WorkShift:    employee.WorkShift,
		Status:       employee.User.Status,
		CreatedAt:    employee.User.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	return response, nil
}
