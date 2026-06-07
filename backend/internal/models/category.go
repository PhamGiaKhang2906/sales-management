package models

type Category struct {
<<<<<<< HEAD
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:100;not null;uniqueIndex"`
	StoreID  uint   `gorm:"not null"`
	Store    Store  `gorm:"foreignKey:StoreID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	
=======
	ID      uint  `gorm:"primaryKey"`
	StoreID uint  `gorm:"not null;index:idx_store_name,priority:1"`
	Store   Store `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	// composite unique index on store_id + name to allow same name across different stores
	Name     string `gorm:"size:100;not null;index:idx_store_name,unique,priority:2"`
>>>>>>> a0fd1a1dc8374a0b8553acf80379a23942581e4f
	Products []Product
}
