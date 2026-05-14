package models

type OrderItem struct {
	ID        uint    `gorm:"primaryKey"`
	OrderID   uint    `gorm:"not null;index"`
	Order     Order   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	ProductID uint    `gorm:"not null;index"`
	Product   Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Quantity  int64   `gorm:"not null"`
	UnitPrice float64 `gorm:"type:numeric(18,2);not null"`
	Subtotal  float64 `gorm:"type:numeric(18,2);not null"`
}
