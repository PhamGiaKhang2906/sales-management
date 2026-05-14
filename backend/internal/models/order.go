package models

import "time"

type Order struct {
	ID          uint      `gorm:"primaryKey"`
	CustomerID  *uint     `gorm:"index"`
	Customer    *Customer `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	UserID      uint      `gorm:"not null;index"`
	User        User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	TotalAmount float64   `gorm:"type:numeric(18,2);not null"`
	Discount    float64   `gorm:"type:numeric(18,2);default:0"`
	Tax         float64   `gorm:"type:numeric(18,2);default:0"`
	FinalAmount float64   `gorm:"type:numeric(18,2);not null"`
	Status      string    `gorm:"size:50;default:'pending'"`
	CreatedAt   time.Time `gorm:"autoCreateTime;index"`
	OrderItems  []OrderItem
	Invoice     *Invoice
}
