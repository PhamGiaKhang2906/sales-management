package models

import "time"

type Employee struct {
	ID           uint   `gorm:"primaryKey"`
	UserID       uint   `gorm:"not null;uniqueIndex"`
	User         *User  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CCCD         string `gorm:"size:20"`
	Address      string `gorm:"size:255"`
	Birthday     *time.Time
	SalaryFactor float64 `gorm:"type:numeric(10,2);default:1.00"`
	WorkShift    string  `gorm:"size:100"`
}
