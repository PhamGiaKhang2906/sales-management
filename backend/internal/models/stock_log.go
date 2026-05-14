package models

import "time"

type StockLog struct {
	ID        uint      `gorm:"primaryKey"`
	ProductID uint      `gorm:"not null;index"`
	Product   Product   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Type      string    `gorm:"size:50;not null"`
	Quantity  int64     `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime;index"`
}
