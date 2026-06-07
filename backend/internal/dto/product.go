package dto

// ProductCreateRequest represents request to create a product
type ProductCreateRequest struct {
	CategoryID   uint    `json:"category_id" binding:"required,gt=0"`
	SupplierID   uint    `json:"supplier_id" binding:"required,gt=0"`
	SKU          string  `json:"sku" binding:"required,min=1,max=100"`
	Barcode      string  `json:"barcode" binding:"max=100"`
	Name         string  `json:"name" binding:"required,min=1,max=255"`
	Unit         string  `json:"unit" binding:"max=50"`
	Price        float64 `json:"price" binding:"required,gt=0"`
	Status       string  `json:"status" binding:"max=50"`
	CurrentStock *int64  `json:"current_stock"`
	MinStock     *int64  `json:"min_stock"`
}

// ProductUpdateRequest represents request to update a product
type ProductUpdateRequest struct {
	CategoryID   uint    `json:"category_id" binding:"required,gt=0"`
	SupplierID   uint    `json:"supplier_id" binding:"required,gt=0"`
	SKU          string  `json:"sku" binding:"required,min=1,max=100"`
	Barcode      string  `json:"barcode" binding:"max=100"`
	Name         string  `json:"name" binding:"required,min=1,max=255"`
	Unit         string  `json:"unit" binding:"max=50"`
	Price        float64 `json:"price" binding:"required,gt=0"`
	Status       string  `json:"status" binding:"max=50"`
	CurrentStock *int64  `json:"current_stock"`
	MinStock     *int64  `json:"min_stock"`
}

// ProductResponse represents a product in response
type ProductResponse struct {
	ID           uint    `json:"id"`
	CategoryID   uint    `json:"category_id"`
	CategoryName string  `json:"category_name"`
	SupplierID   uint    `json:"supplier_id"`
	SupplierName string  `json:"supplier_name"`
	SKU          string  `json:"sku"`
	Barcode      string  `json:"barcode"`
	Name         string  `json:"name"`
	Unit         string  `json:"unit"`
	Price        float64 `json:"price"`
	Status       string  `json:"status"`
	CurrentStock int64   `json:"current_stock"`
	MinStock     int64   `json:"min_stock"`
}

// ProductsListResponse represents a list of products
type ProductsListResponse struct {
	Products []ProductResponse `json:"products"`
	Total    int               `json:"total"`
}
