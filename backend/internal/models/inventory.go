package models

type Inventory struct {
	ProductID    uint     `gorm:"primaryKey"`
	Product      *Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CurrentStock int64    `gorm:"default:0"`
	MinStock     int64    `gorm:"default:0"`
}
