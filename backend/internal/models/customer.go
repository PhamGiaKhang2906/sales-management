package models

type Customer struct {
	ID          uint    `gorm:"primaryKey"`
	Code        string  `gorm:"size:50;not null;uniqueIndex"`
	Name        string  `gorm:"size:255;not null"`
	Phone       string  `gorm:"size:20;not null;index"`
	Email       string  `gorm:"size:150"`
	Address     string  `gorm:"size:255"`
	TotalSpent  float64 `gorm:"type:numeric(18,2);default:0"`
	LoyaltyRank string  `gorm:"size:50;default:'Bronze'"`
	Orders      []Order
}
