package dto

// OwnerStoreUpdateRequest represents request to update owner's store information.
type OwnerStoreUpdateRequest struct {
	Name    string `json:"name" binding:"required,min=1,max=150"`
	Address string `json:"address" binding:"max=255"`
	Phone   string `json:"phone" binding:"required,min=10,max=20"`
}

// OwnerStoreResponse represents owner's store information.
type OwnerStoreResponse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	Phone         string `json:"phone"`
	StoreTypeID   uint   `json:"store_type_id"`
	StoreTypeName string `json:"store_type_name"`
}
