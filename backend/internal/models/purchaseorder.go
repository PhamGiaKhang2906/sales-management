package models

import "time"

type PurchaseOrder struct {
	ID          uint                `gorm:"primaryKey;autoIncrement"`
	SupplierID  uint                `gorm:"not null"`
	Supplier    Supplier            `gorm:"foreignKey:SupplierID"`
	UserID      uint                `gorm:"not null"` // Nhân viên kho/Thu mua thực hiện
	User        User                `gorm:"foreignKey:UserID"`
	StoreID     uint                `gorm:"not null"` // Nhập vào kho của cửa hàng nào
	Store       Store               `gorm:"foreignKey:StoreID"`
	TotalAmount float64             `gorm:"type:decimal(15,2);not null"` // Tổng tiền hàng nhập
	Tax         float64             `gorm:"type:decimal(15,2);default:0"`
	Status      string              `gorm:"type:varchar(50);not null;default:'pending'"` // pending, completed, cancelled
	CreatedAt   time.Time           `gorm:"autoCreateTime"`
	Items       []PurchaseOrderItem `gorm:"foreignKey:PurchaseOrderID"`
}
