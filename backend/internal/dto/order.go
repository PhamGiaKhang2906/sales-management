package dto

import "time"

// OrderItemRequest represents a product line in an order request.
type OrderItemRequest struct {
	ProductID uint  `json:"product_id" binding:"required,gt=0"`
	Quantity  int64 `json:"quantity" binding:"required,gt=0"`
}

// CustomerRequest represents the request to create a new customer during order creation.
type CustomerRequest struct {
	Name    string `json:"name" binding:"required"`
	Phone   string `json:"phone" binding:"required"`
	Address string `json:"address"`
}

// OrderCreateRequest represents request to create an order.
type OrderCreateRequest struct {
	CustomerID *uint              `json:"customer_id"`
	Customer   *CustomerRequest   `json:"customer"`
	Discount   float64            `json:"discount"`
	Tax        float64            `json:"tax"`
	Items      []OrderItemRequest `json:"items" binding:"required,min=1,dive"`
}

// OrderUpdateRequest represents request to update an order.
type OrderUpdateRequest struct {
	CustomerID *uint              `json:"customer_id"`
	Discount   float64            `json:"discount"`
	Tax        float64            `json:"tax"`
	Items      []OrderItemRequest `json:"items" binding:"required,min=1,dive"`
}

// OrderItemResponse represents a line item in an order response.
type OrderItemResponse struct {
	ID           uint    `json:"id"`
	ProductID    uint    `json:"product_id"`
	ProductName  string  `json:"product_name"`
	SKU          string  `json:"sku"`
	Quantity     int64   `json:"quantity"`
	UnitPrice    float64 `json:"unit_price"`
	Subtotal     float64 `json:"subtotal"`
	CategoryName string  `json:"category_name"`
	SupplierName string  `json:"supplier_name"`
	StockLeft    int64   `json:"stock_left"`
}

// OrderResponse represents an order in response.
type OrderResponse struct {
	ID           uint                `json:"id"`
	CustomerID   *uint               `json:"customer_id"`
	CustomerName string              `json:"customer_name"`
	CustomerPhone string             `json:"customer_phone"`
	CustomerAddress string           `json:"customer_address"`
	UserID       uint                `json:"user_id"`
	TotalAmount  float64             `json:"total_amount"`
	Discount     float64             `json:"discount"`
	Tax          float64             `json:"tax"`
	FinalAmount  float64             `json:"final_amount"`
	Status       string              `json:"status"`
	CreatedAt    time.Time           `json:"created_at"`
	Items        []OrderItemResponse `json:"items"`
}

// OrdersListResponse represents a list of orders.
type OrdersListResponse struct {
	Orders []OrderResponse `json:"orders"`
	Total  int             `json:"total"`
}

// ChangeOrderStatusRequest represents a request to change order status.
type ChangeOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=Đã_trả"`
}
