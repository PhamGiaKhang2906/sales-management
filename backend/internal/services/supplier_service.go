package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/models"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type SupplierService struct {
	supplierRepo *repository.SupplierRepository
}

// NewSupplierService creates a new supplier service
func NewSupplierService(supplierRepo *repository.SupplierRepository) *SupplierService {
	return &SupplierService{
		supplierRepo: supplierRepo,
	}
}

// GetAllSuppliers retrieves all suppliers
func (s *SupplierService) GetAllSuppliers() (*dto.SuppliersListResponse, error) {
	suppliers, err := s.supplierRepo.GetAllSuppliers()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách nhà cung cấp")
	}

	// Convert to response
	var responses []dto.SupplierResponse
	for _, sup := range suppliers {
		responses = append(responses, dto.SupplierResponse{
			ID:      sup.ID,
			Name:    sup.Name,
			Phone:   sup.Phone,
			Email:   sup.Email,
			Address: sup.Address,
			TaxCode: sup.TaxCode,
			Status:  sup.Status,
		})
	}

	return &dto.SuppliersListResponse{
		Suppliers: responses,
		Total:     len(responses),
	}, nil
}

// CreateSupplier creates a new supplier
func (s *SupplierService) CreateSupplier(req *dto.SupplierCreateRequest) (*dto.SupplierResponse, error) {
	// Validate inputs
	if req.Name == "" {
		return nil, errors.New("Tên nhà cung cấp không được để trống")
	}
	if req.Email == "" {
		return nil, errors.New("Email không được để trống")
	}

	// Check if email already exists
	exists, err := s.supplierRepo.CheckSupplierEmailExists(req.Email)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra email")
	}
	if exists {
		return nil, errors.New("Email nhà cung cấp đã tồn tại")
	}

	// Create supplier
	supplier := &models.Supplier{
		Name:    req.Name,
		Phone:   req.Phone,
		Email:   req.Email,
		Address: req.Address,
		TaxCode: req.TaxCode,
		Status:  "active",
	}

	if err := s.supplierRepo.CreateSupplier(supplier); err != nil {
		return nil, errors.New("Lỗi khi tạo nhà cung cấp")
	}

	response := &dto.SupplierResponse{
		ID:      supplier.ID,
		Name:    supplier.Name,
		Phone:   supplier.Phone,
		Email:   supplier.Email,
		Address: supplier.Address,
		TaxCode: supplier.TaxCode,
		Status:  supplier.Status,
	}

	return response, nil
}

// UpdateSupplier updates an existing supplier
func (s *SupplierService) UpdateSupplier(id uint, req *dto.SupplierUpdateRequest) (*dto.SupplierResponse, error) {
	// Validate inputs
	if req.Name == "" {
		return nil, errors.New("Tên nhà cung cấp không được để trống")
	}
	if req.Email == "" {
		return nil, errors.New("Email không được để trống")
	}

	// Check if supplier exists
	supplier, err := s.supplierRepo.GetSupplierByID(id)
	if err != nil {
		return nil, errors.New("Nhà cung cấp không tồn tại")
	}

	// Check if new email already exists (excluding current ID)
	exists, err := s.supplierRepo.CheckSupplierEmailExistsExcept(req.Email, id)
	if err != nil {
		return nil, errors.New("Lỗi khi kiểm tra email")
	}
	if exists {
		return nil, errors.New("Email nhà cung cấp đã tồn tại")
	}

	// Update supplier
	supplier.Name = req.Name
	supplier.Phone = req.Phone
	supplier.Email = req.Email
	supplier.Address = req.Address
	supplier.TaxCode = req.TaxCode

	if err := s.supplierRepo.UpdateSupplier(supplier); err != nil {
		return nil, errors.New("Lỗi khi cập nhật nhà cung cấp")
	}

	response := &dto.SupplierResponse{
		ID:      supplier.ID,
		Name:    supplier.Name,
		Phone:   supplier.Phone,
		Email:   supplier.Email,
		Address: supplier.Address,
		TaxCode: supplier.TaxCode,
		Status:  supplier.Status,
	}

	return response, nil
}

// DeleteSupplier deletes a supplier by ID
func (s *SupplierService) DeleteSupplier(id uint) error {
	// Check if supplier exists
	_, err := s.supplierRepo.GetSupplierByID(id)
	if err != nil {
		return errors.New("Nhà cung cấp không tồn tại")
	}

	// Delete supplier
	if err := s.supplierRepo.DeleteSupplier(id); err != nil {
		return errors.New("Lỗi khi xóa nhà cung cấp")
	}

	return nil
}
