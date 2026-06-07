package models

type Category struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:100;not null;uniqueIndex"`
	StoreID  uint   `gorm:"not null"`
	Store    Store  `gorm:"foreignKey:StoreID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	
	Products []Product
}
