package utils

import (
	"regexp"
	"strings"
)

// ValidatePassword checks if password is at least 8 characters (excluding whitespace)
func ValidatePassword(password string) (bool, string) {
	cleanPassword := strings.TrimSpace(password)
	if len(cleanPassword) < 8 {
		return false, "Mật khẩu phải tối thiểu 8 ký tự (không tính khoảng trắng)"
	}
	return true, ""
}

// ValidatePhone checks if phone number is exactly 10 digits
func ValidatePhone(phone string) (bool, string) {
	cleanPhone := strings.TrimSpace(phone)
	matched, _ := regexp.MatchString(`^\d{10}$`, cleanPhone)
	if !matched {
		return false, "Số điện thoại phải đúng 10 chữ số"
	}
	return true, ""
}

// ValidateUsername checks if username is not empty
func ValidateUsername(username string) (bool, string) {
	cleanUsername := strings.TrimSpace(username)
	if cleanUsername == "" {
		return false, "Tên đăng nhập không được để trống"
	}
	return true, ""
}

// ValidateFullname checks if fullname is not empty
func ValidateFullname(fullname string) (bool, string) {
	cleanFullname := strings.TrimSpace(fullname)
	if cleanFullname == "" {
		return false, "Tên người dùng không được để trống"
	}
	return true, ""
}
