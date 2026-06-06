package models

type Store struct {
	ID           uint       `gorm:"primaryKey"`
	Name         string     `gorm:"size:150;not null"`
	TaxCode      string     `gorm:"size:50"`
	Address      string     `gorm:"size:255"`
	Phone        string     `gorm:"size:20"`
	Email        string     `gorm:"size:100"`
	Website      string     `gorm:"size:255"`
	OpeningHours string     `gorm:"size:100"`
	StoreTypeID  uint       `gorm:"not null;index"`
	StoreType    *StoreType `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Users        []User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
