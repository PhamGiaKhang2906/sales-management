package models

type StoreType struct {
	ID     uint    `gorm:"primaryKey"`
	Name   string  `gorm:"size:100;not null;uniqueIndex"`
	Stores []Store `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}
