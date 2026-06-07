package models

type PurchaseOrderItem struct {
	ID              uint          `gorm:"primaryKey;autoIncrement"`
	PurchaseOrderID uint          `gorm:"not null"`
	PurchaseOrder   PurchaseOrder `gorm:"foreignKey:PurchaseOrderID"`
	ProductID       uint          `gorm:"not null"`
	Product         Product       `gorm:"foreignKey:ProductID"`
	Quantity        int           `gorm:"not null"`
	ImportPrice     float64       `gorm:"type:decimal(15,2);not null"`
	Subtotal        float64       `gorm:"type:decimal(15,2);not null"`
}
