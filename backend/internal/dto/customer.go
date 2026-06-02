package dto

// CustomerCreateRequest represents request to create a customer
type CustomerCreateRequest struct {
	Code    string `json:"code" binding:"required,min=1,max=50"`
	Name    string `json:"name" binding:"required,min=1,max=255"`
	Phone   string `json:"phone" binding:"required,min=10,max=20"`
	Email   string `json:"email" binding:"required,email,max=150"`
	Address string `json:"address" binding:"required,min=1,max=255"`
}

// CustomerUpdateRequest represents request to update a customer
type CustomerUpdateRequest struct {
	Code    string `json:"code" binding:"required,min=1,max=50"`
	Name    string `json:"name" binding:"required,min=1,max=255"`
	Phone   string `json:"phone" binding:"required,min=10,max=20"`
	Email   string `json:"email" binding:"required,email,max=150"`
	Address string `json:"address" binding:"required,min=1,max=255"`
}

// CustomerResponse represents a customer in response
type CustomerResponse struct {
	ID          uint    `json:"id"`
	Code        string  `json:"code"`
	Name        string  `json:"name"`
	Phone       string  `json:"phone"`
	Email       string  `json:"email"`
	Address     string  `json:"address"`
	TotalSpent  float64 `json:"total_spent"`
	LoyaltyRank string  `json:"loyalty_rank"`
}

// CustomersListResponse represents a list of customers
type CustomersListResponse struct {
	Customers []CustomerResponse `json:"customers"`
	Total     int                `json:"total"`
}
