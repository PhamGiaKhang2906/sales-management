package initializers

func SyncDatabase() {
	DB.AutoMigrate()
}
