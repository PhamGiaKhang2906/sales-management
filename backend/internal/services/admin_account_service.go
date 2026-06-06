package services

import (
	"errors"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type AdminAccountService struct {
	userRepo *repository.UserRepository
}

func NewAdminAccountService(userRepo *repository.UserRepository) *AdminAccountService {
	return &AdminAccountService{
		userRepo: userRepo,
	}
}

func (s *AdminAccountService) GetAccountsWithStats() (*dto.AccountsResponse, error) {
	accounts, err := s.userRepo.GetAllAccounts()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy danh sách tài khoản")
	}

	statusCounts, err := s.userRepo.CountAccountsByStatus()
	if err != nil {
		return nil, errors.New("Lỗi khi đếm tài khoản theo trạng thái")
	}

	totalCount, err := s.userRepo.GetTotalAccountsCount()
	if err != nil {
		return nil, errors.New("Lỗi khi lấy tổng số tài khoản")
	}

	var accountInfos []dto.AccountInfo
	for _, acc := range accounts {
		accountInfo := dto.AccountInfo{
			UserID:    uint(acc["user_id"].(int64)),
			FullName:  acc["fullname"].(string),
			Phone:     acc["phone"].(string),
			StoreName: acc["store_name"].(string),
			Status:    acc["status"].(string),
		}

		if acc["category"] != nil {
			accountInfo.Category = acc["category"].(string)
		} else {
			accountInfo.Category = ""
		}

		// BỔ SUNG ĐOẠN NÀY ĐỂ MAP ĐỊA CHỈ
		if acc["address"] != nil {
			accountInfo.Address = acc["address"].(string)
		} else {
			accountInfo.Address = ""
		}

		accountInfos = append(accountInfos, accountInfo)
	}

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

func (s *AdminAccountService) ChangeAccountStatus(req *dto.ChangeAccountStatusRequest) (*dto.ChangeAccountStatusResponse, error) {
	if req.Status != "Đã_duyệt" && req.Status != "Từ_chối" {
		return nil, errors.New("Trạng thái không hợp lệ. Chỉ chấp nhận 'Đã_duyệt' hoặc 'Từ_chối'")
	}

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
