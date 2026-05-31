package dto

// RegisterRequest represents the registration request payload
type RegisterRequest struct {
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Phone     string `json:"phone" binding:"required"`
	FullName  string `json:"fullname" binding:"required"`
	StoreType string `json:"store_type" binding:"required"`
}

// RegisterResponse represents the registration response
type RegisterResponse struct {
	UserID  uint   `json:"user_id"`
	StoreID uint   `json:"store_id"`
	Message string `json:"message"`
}
