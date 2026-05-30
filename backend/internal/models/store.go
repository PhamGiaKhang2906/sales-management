package models

type Store struct {
	ID          uint       `gorm:"primaryKey"`
	Name        string     `gorm:"size:150;not null"`
	Address     string     `gorm:"size:255"`
	Phone       string     `gorm:"size:20"`
	StoreTypeID uint       `gorm:"not null;index"`
	StoreType   *StoreType `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Users       []User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
