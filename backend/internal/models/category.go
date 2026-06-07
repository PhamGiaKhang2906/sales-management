package models

type Category struct {
	ID      uint  `gorm:"primaryKey"`
	StoreID uint  `gorm:"not null;index:idx_store_name,priority:1"`
	Store   Store `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	// composite unique index on store_id + name to allow same name across different stores
	Name     string `gorm:"size:100;not null;index:idx_store_name,unique,priority:2"`
	Products []Product
}
