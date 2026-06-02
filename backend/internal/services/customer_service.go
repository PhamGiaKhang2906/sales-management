package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type CustomerService struct {
	customerRepo *repository.CustomerRepository
}

// NewCustomerService creates a new customer service
func NewCustomerService(customerRepo *repository.CustomerRepository) *CustomerService {
	return &CustomerService{customerRepo: customerRepo}
}

// GetAllCustomers retrieves all customers
func (s *CustomerService) GetAllCustomers() (*dto.CustomersListResponse, error) {
	customers, err := s.customerRepo.GetAllCustomers()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách khách hàng")
	}

	responses := make([]dto.CustomerResponse, 0, len(customers))
	for _, customer := range customers {
		responses = append(responses, dto.CustomerResponse{
			ID:          customer.ID,
			Code:        customer.Code,
			Name:        customer.Name,
			Phone:       customer.Phone,
			Email:       customer.Email,
			Address:     customer.Address,
			TotalSpent:  customer.TotalSpent,
			LoyaltyRank: customer.LoyaltyRank,
		})
	}

	return &dto.CustomersListResponse{
		Customers: responses,
		Total:     len(responses),
	}, nil
}

// GetCustomerByID retrieves a customer by ID
func (s *CustomerService) GetCustomerByID(id uint) (*dto.CustomerResponse, error) {
	customer, err := s.customerRepo.GetCustomerByID(id)
	if err != nil {
		return nil, errors.New("Khách hàng không tồn tại")
	}

	response := s.toCustomerResponse(customer)
	return &response, nil
}

// CreateCustomer creates a new customer
func (s *CustomerService) CreateCustomer(req *dto.CustomerCreateRequest) (*dto.CustomerResponse, error) {
	if req.Code == "" {
		return nil, errors.New("Mã khách hàng không được để trống")
	}
	if req.Name == "" {
		return nil, errors.New("Tên khách hàng không được để trống")
	}
	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}
	if req.Email == "" {
		return nil, errors.New("Email không được để trống")
	}
	if req.Address == "" {
		return nil, errors.New("Địa chỉ không được để trống")
	}

	codeExists, err := s.customerRepo.CheckCustomerCodeExists(req.Code)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra mã khách hàng")
	}
	if codeExists {
		return nil, errors.New("Mã khách hàng đã tồn tại")
	}

	phoneExists, err := s.customerRepo.CheckCustomerPhoneExists(req.Phone)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại")
	}
	if phoneExists {
		return nil, errors.New("Số điện thoại đã tồn tại")
	}

	customer := &models.Customer{
		Code:        req.Code,
		Name:        req.Name,
		Phone:       req.Phone,
		Email:       req.Email,
		Address:     req.Address,
		TotalSpent:  0,
		LoyaltyRank: "Bronze",
	}

	if err := s.customerRepo.CreateCustomer(customer); err != nil {
		return nil, errors.New("Lỗi khi tạo khách hàng")
	}

	response := s.toCustomerResponse(customer)
	return &response, nil
}

// UpdateCustomer updates an existing customer
func (s *CustomerService) UpdateCustomer(id uint, req *dto.CustomerUpdateRequest) (*dto.CustomerResponse, error) {
	if req.Code == "" {
		return nil, errors.New("Mã khách hàng không được để trống")
	}
	if req.Name == "" {
		return nil, errors.New("Tên khách hàng không được để trống")
	}
	if req.Phone == "" {
		return nil, errors.New("Số điện thoại không được để trống")
	}
	if req.Email == "" {
		return nil, errors.New("Email không được để trống")
	}
	if req.Address == "" {
		return nil, errors.New("Địa chỉ không được để trống")
	}

	customer, err := s.customerRepo.GetCustomerByID(id)
	if err != nil {
		return nil, errors.New("Khách hàng không tồn tại")
	}

	codeExists, err := s.customerRepo.CheckCustomerCodeExistsExcept(req.Code, id)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra mã khách hàng")
	}
	if codeExists {
		return nil, errors.New("Mã khách hàng đã tồn tại")
	}

	phoneExists, err := s.customerRepo.CheckCustomerPhoneExistsExcept(req.Phone, id)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra số điện thoại")
	}
	if phoneExists {
		return nil, errors.New("Số điện thoại đã tồn tại")
	}

	customer.Code = req.Code
	customer.Name = req.Name
	customer.Phone = req.Phone
	customer.Email = req.Email
	customer.Address = req.Address

	if err := s.customerRepo.UpdateCustomer(customer); err != nil {
		return nil, errors.New("Lỗi khi cập nhật khách hàng")
	}

	updatedCustomer, err := s.customerRepo.GetCustomerByID(id)
	if err != nil {
		return nil, errors.New("Lỗi khi lấy thông tin khách hàng vừa cập nhật")
	}

	response := s.toCustomerResponse(updatedCustomer)
	return &response, nil
}

// DeleteCustomer deletes a customer by ID
func (s *CustomerService) DeleteCustomer(id uint) error {
	if _, err := s.customerRepo.GetCustomerByID(id); err != nil {
		return errors.New("Khách hàng không tồn tại")
	}

	if err := s.customerRepo.DeleteCustomer(id); err != nil {
		return errors.New("Lỗi khi xóa khách hàng")
	}

	return nil
}

func (s *CustomerService) toCustomerResponse(customer *models.Customer) dto.CustomerResponse {
	return dto.CustomerResponse{
		ID:          customer.ID,
		Code:        customer.Code,
		Name:        customer.Name,
		Phone:       customer.Phone,
		Email:       customer.Email,
		Address:     customer.Address,
		TotalSpent:  customer.TotalSpent,
		LoyaltyRank: customer.LoyaltyRank,
	}
}
