package dto

// OwnerStoreUpdateRequest represents request to update owner's store information.
type OwnerStoreUpdateRequest struct {
	Name         string `json:"name" binding:"required"`
	TaxCode      string `json:"taxCode"` // Thêm mới
	Address      string `json:"address"`
	Phone        string `json:"phone" binding:"required"`
	Email        string `json:"email"`        // Thêm mới
	Website      string `json:"website"`      // Thêm mới
	OpeningHours string `json:"openingHours"` // Thêm mới
}

// OwnerStoreResponse represents owner's store information.
type OwnerStoreResponse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	TaxCode       string `json:"taxCode"` // Thêm mới
	Address       string `json:"address"`
	Phone         string `json:"phone"`
	Email         string `json:"email"`        // Thêm mới
	Website       string `json:"website"`      // Thêm mới
	OpeningHours  string `json:"openingHours"` // Thêm mới
	StoreTypeID   uint   `json:"storeTypeId"`
	StoreTypeName string `json:"storeTypeName,omitempty"`
}
