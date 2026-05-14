package models

type Category struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:100;not null;uniqueIndex"`
	Products []Product
}
