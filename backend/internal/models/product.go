package models

type Product struct {
	ID         uint     `gorm:"primaryKey"`
	CategoryID uint     `gorm:"not null;index"`
	Category   Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	SupplierID uint     `gorm:"not null;index"`
	Supplier   Supplier `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	SKU        string   `gorm:"size:100;not null;uniqueIndex"`
	Barcode    string   `gorm:"size:100;index"`
	Name       string   `gorm:"size:255;not null"`
	Unit       string   `gorm:"size:50"`
	Price      float64  `gorm:"type:numeric(15,2);not null"`
	Status     string   `gorm:"size:50;default:'active'"`
	Inventory  *Inventory
	OrderItems []OrderItem
	StockLogs  []StockLog
}
