package models

import "time"

type Invoice struct {
	ID            uint      `gorm:"primaryKey"`
	OrderID       uint      `gorm:"not null;uniqueIndex"`
	Order         *Order    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	InvoiceCode   string    `gorm:"size:100;not null;uniqueIndex"`
	PaymentMethod string    `gorm:"size:100;not null"`
	CreatedAt     time.Time `gorm:"autoCreateTime;index"`
}
