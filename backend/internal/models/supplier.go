package models

type Supplier struct {
	ID      uint   `gorm:"primaryKey"`
	Name    string `gorm:"size:150;not null;index"`
	Phone   string `gorm:"size:20"`
	Email   string `gorm:"size:150"`
	Address string `gorm:"size:255"`
	TaxCode string `gorm:"size:100"`
	Status  string `gorm:"size:50;default:'active'"`
	StoreID uint   `gorm:"not null;index"`
	Store   Store  `gorm:"foreignKey:StoreID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Products []Product
}
