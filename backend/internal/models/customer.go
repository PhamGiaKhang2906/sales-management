package models

type Customer struct {
	ID          uint    `gorm:"primaryKey"`
	Name        string  `gorm:"size:255;not null"`
	Phone       string  `gorm:"size:20;index"`
	TotalSpent  float64 `gorm:"type:numeric(18,2);default:0"`
	LoyaltyRank string  `gorm:"size:50;default:'Bronze'"`
	Orders      []Order
}
