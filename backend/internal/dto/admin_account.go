package dto

// AccountInfo represents account information for admin view
type AccountInfo struct {
	UserID    uint   `json:"user_id"`
	FullName  string `json:"fullname"`
	Phone     string `json:"phone"`
	StoreName string `json:"store_name"`
	Category  string `json:"category"`
	Status    string `json:"status"`
	Address   string `json:"address"`
}

// AccountsStats represents statistics about accounts
type AccountsStats struct {
	TotalAccounts int `json:"total_accounts"`
	PendingCount  int `json:"pending_count"`
	ApprovedCount int `json:"approved_count"`
	RejectedCount int `json:"rejected_count"`
}

// AccountsResponse represents the response containing accounts list and stats
type AccountsResponse struct {
	Accounts []AccountInfo `json:"accounts"`
	Stats    AccountsStats `json:"stats"`
}

// ChangeAccountStatusRequest represents request to change account status
type ChangeAccountStatusRequest struct {
	UserID uint   `json:"user_id" binding:"required"`
	Status string `json:"status" binding:"required,oneof=Đã_duyệt Từ_chối"`
}

// ChangeAccountStatusResponse represents response after changing status
type ChangeAccountStatusResponse struct {
	UserID  uint   `json:"user_id"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

// StoreTypeCreateRequest represents request to create a store type
type StoreTypeCreateRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// StoreTypeUpdateRequest represents request to update a store type
type StoreTypeUpdateRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// StoreTypeResponse represents a store type in response
type StoreTypeResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// StoreTypesListResponse represents a list of store types
type StoreTypesListResponse struct {
	StoreTypes      []StoreTypeResponse `json:"store_types"`
	Total           int                 `json:"total"`
	TotalStores     int64               `json:"total_stores"`
	MostPopularType string              `json:"most_popular_type"`
}

// ===== Supplier DTOs =====

// SupplierCreateRequest represents request to create a supplier
type SupplierCreateRequest struct {
	Name    string `json:"name" binding:"required,min=1,max=150"`
	Phone   string `json:"phone" binding:"required,min=10,max=20"`
	Email   string `json:"email" binding:"required,email,max=150"`
	Address string `json:"address" binding:"max=255"`
	TaxCode string `json:"tax_code" binding:"max=100"`
}

// SupplierUpdateRequest represents request to update a supplier
type SupplierUpdateRequest struct {
	Name    string `json:"name" binding:"required,min=1,max=150"`
	Phone   string `json:"phone" binding:"required,min=10,max=20"`
	Email   string `json:"email" binding:"required,email,max=150"`
	Address string `json:"address" binding:"max=255"`
	TaxCode string `json:"tax_code" binding:"max=100"`
}

// SupplierResponse represents a supplier in response
type SupplierResponse struct {
	ID      uint   `json:"id"`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Address string `json:"address"`
	TaxCode string `json:"tax_code"`
	Status  string `json:"status"`
}

// SuppliersListResponse represents a list of suppliers
type SuppliersListResponse struct {
	Suppliers []SupplierResponse `json:"suppliers"`
	Total     int                `json:"total"`
}

// ===== Category DTOs =====

// CategoryCreateRequest represents request to create a category
type CategoryCreateRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// CategoryUpdateRequest represents request to update a category
type CategoryUpdateRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

// CategoryResponse represents a category in response
type CategoryResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// CategoriesListResponse represents a list of categories
type CategoriesListResponse struct {
	Categories []CategoryResponse `json:"categories"`
	Total      int                `json:"total"`
}

// ===== Employee DTOs =====

// EmployeeCreateRequest represents request to create an employee
type EmployeeCreateRequest struct {
	Fullname     string  `json:"fullname" binding:"required,min=1,max=100"`
	Username     string  `json:"username" binding:"required,min=5,max=50"`
	Password     string  `json:"password" binding:"required,min=6,max=100"`
	Phone        string  `json:"phone" binding:"required,min=10,max=20"`
	RoleName     string  `json:"role_name" binding:"required,oneof=sales warehouse"`
	CCCD         string  `json:"cccd" binding:"max=20"`
	Address      string  `json:"address" binding:"max=255"`
	Birthday     *string `json:"birthday"`                      // Format: YYYY-MM-DD
	SalaryFactor float64 `json:"salary_factor" binding:"min=0"` // Default: 1.00
	WorkShift    string  `json:"work_shift" binding:"max=100"`
}

// EmployeeUpdateRequest represents request to update an employee
type EmployeeUpdateRequest struct {
	Fullname     string  `json:"fullname" binding:"required,min=1,max=100"`
	Phone        string  `json:"phone" binding:"required,min=10,max=20"`
	CCCD         string  `json:"cccd" binding:"max=20"`
	Address      string  `json:"address" binding:"max=255"`
	Birthday     *string `json:"birthday"` // Format: YYYY-MM-DD
	SalaryFactor float64 `json:"salary_factor" binding:"min=0"`
	WorkShift    string  `json:"work_shift" binding:"max=100"`
}

// EmployeeResponse represents an employee in response
type EmployeeResponse struct {
	ID           uint    `json:"id"`
	UserID       uint    `json:"user_id"`
	Username     string  `json:"username"`
	Fullname     string  `json:"fullname"`
	Phone        string  `json:"phone"`
	CCCD         string  `json:"cccd"`
	Address      string  `json:"address"`
	Birthday     *string `json:"birthday"`
	SalaryFactor float64 `json:"salary_factor"`
	WorkShift    string  `json:"work_shift"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"created_at"`
}

// EmployeesListResponse represents a list of employees
type EmployeesListResponse struct {
	Employees []EmployeeResponse `json:"employees"`
	Total     int                `json:"total"`
}
