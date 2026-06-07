package dto

import "time"

type PurchaseOrderItemCreate struct {
	ProductID   uint    `json:"product_id" binding:"required,gt=0"`
	Quantity    int64   `json:"quantity" binding:"required,gt=0"`
	ImportPrice float64 `json:"import_price" binding:"required,gt=0"`
}

type PurchaseOrderCreateRequest struct {
	SupplierID uint                      `json:"supplier_id" binding:"required,gt=0"`
	StoreID    uint                      `json:"store_id"`
	Items      []PurchaseOrderItemCreate `json:"items" binding:"required,dive,required"`
	Tax        float64                   `json:"tax"`
}

type PurchaseOrderItemResponse struct {
	ProductID   uint    `json:"product_id"`
	ProductName string  `json:"product_name"`
	Quantity    int64   `json:"quantity"`
	ImportPrice float64 `json:"import_price"`
	Subtotal    float64 `json:"subtotal"`
}

type PurchaseOrderResponse struct {
	ID          uint                        `json:"id"`
	SupplierID  uint                        `json:"supplier_id"`
	Supplier    string                      `json:"supplier_name"`
	StoreID     uint                        `json:"store_id"`
	TotalAmount float64                     `json:"total_amount"`
	Tax         float64                     `json:"tax"`
	Status      string                      `json:"status"`
	CreatedAt   time.Time                   `json:"created_at"`
	Items       []PurchaseOrderItemResponse `json:"items"`
}

type PurchaseOrdersListResponse struct {
	Orders []PurchaseOrderResponse `json:"orders"`
	Total  int                     `json:"total"`
}
