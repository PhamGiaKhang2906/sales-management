package models

type Role struct {
	ID       uint   `gorm:"primaryKey"`
	RoleName string `gorm:"size:50;not null;uniqueIndex"`
	Users    []User
}
