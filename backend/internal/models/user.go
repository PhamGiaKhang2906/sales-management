package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"size:100;not null;uniqueIndex"`
	Password string `gorm:"size:255;not null"`
	FullName string `gorm:"size:150"`
	Phone    string `gorm:"size:20;index"`
	RoleID   uint   `gorm:"not null;index"`
	Role     *Role  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	StoreID  *uint  `gorm:"index"`
	Store    *Store `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Status   string `gorm:"size:30;default:'Chờ_duyệt'"`
	Employee *Employee
	Orders   []Order
}
