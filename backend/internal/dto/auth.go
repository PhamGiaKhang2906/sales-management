package dto

// RegisterRequest represents the registration request payload
type RegisterRequest struct {
	Username  string `json:"username" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Phone     string `json:"phone" binding:"required"`
	FullName  string `json:"fullname" binding:"required"`
	Address   string `json:"address" binding:"required"`
	StoreType string `json:"store_type" binding:"required"`
}

// RegisterResponse represents the registration response
type RegisterResponse struct {
	UserID  uint   `json:"user_id"`
	StoreID uint   `json:"store_id"`
	Message string `json:"message"`
}

// LoginRequest represents the login request payload
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
}

// LoginResponse represents the login response
type LoginResponse struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	RoleID   uint   `json:"role_id"`
	StoreID  uint   `json:"store_id"`
	Message  string `json:"message"`
}
