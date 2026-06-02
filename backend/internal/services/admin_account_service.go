package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type AdminAccountService struct {
	userRepo *repository.UserRepository
}

// NewAdminAccountService creates a new admin account service
func NewAdminAccountService(userRepo *repository.UserRepository) *AdminAccountService {
	return &AdminAccountService{
		userRepo: userRepo,
	}
}

// GetAccountsWithStats retrieves all accounts with statistics
func (s *AdminAccountService) GetAccountsWithStats() (*dto.AccountsResponse, error) {
	// Get all accounts
	accounts, err := s.userRepo.GetAllAccounts()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách tài khoản")
	}

	// Get status counts
	statusCounts, err := s.userRepo.CountAccountsByStatus()
	if err != nil {
		return nil, errors.New("Lỗi khi đếm tài khoản theo trạng thái")
	}

	// Get total count
	totalCount, err := s.userRepo.GetTotalAccountsCount()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy tổng số tài khoản")
	}

	// Convert to AccountInfo slice
	var accountInfos []dto.AccountInfo
	for _, acc := range accounts {
		accountInfo := dto.AccountInfo{
			UserID:    uint(acc["user_id"].(int64)),
			FullName:  acc["fullname"].(string),
			Phone:     acc["phone"].(string),
			StoreName: acc["store_name"].(string),
			Status:    acc["status"].(string),
		}

		// Handle category (can be nil if no store type)
		if acc["category"] != nil {
			accountInfo.Category = acc["category"].(string)
		} else {
			accountInfo.Category = ""
		}

		accountInfos = append(accountInfos, accountInfo)
	}

	// Build response
	response := &dto.AccountsResponse{
		Accounts: accountInfos,
		Stats: dto.AccountsStats{
			TotalAccounts: int(totalCount),
			PendingCount:  statusCounts["Chờ duyệt"],
			ApprovedCount: statusCounts["Đã duyệt"],
			RejectedCount: statusCounts["Từ chối"],
		},
	}

	return response, nil
}

// ChangeAccountStatus changes the status of an account
func (s *AdminAccountService) ChangeAccountStatus(req *dto.ChangeAccountStatusRequest) (*dto.ChangeAccountStatusResponse, error) {
	// Validate status
	if req.Status != "Đã_duyệt" && req.Status != "Từ_chối" {
		return nil, errors.New("Trạng thái không hợp lệ. Chỉ chấp nhận 'Đã_duyệt' hoặc 'Từ_chối'")
	}

	// Update user status
	err := s.userRepo.UpdateUserStatus(req.UserID, req.Status)
	if err != nil {
		return nil, errors.New("Lỗi khi cập nhật trạng thái tài khoản")
	}

	response := &dto.ChangeAccountStatusResponse{
		UserID:  req.UserID,
		Status:  req.Status,
		Message: "Cập nhật trạng thái thành công",
	}

	return response, nil
}
