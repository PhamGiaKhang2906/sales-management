package dto

type WarehouseDashboardResponse struct {
	ImportOrdersToday     int   `json:"importOrdersToday"`
	ImportedProductsToday int64 `json:"importedProductsToday"`
	TotalImportAmount     int64 `json:"totalImportAmount"`
	LowStockAlerts        int   `json:"lowStockAlerts"`
}
