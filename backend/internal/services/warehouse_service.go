package services

import (
	"time"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	repository "github.com/PhamGiaKhang2906/sales-management-backend/internal/reponsitory"
)

type WarehouseService struct {
	poRepo      *repository.PurchaseOrderRepository
	productRepo *repository.ProductRepository
}

func NewWarehouseService(poRepo *repository.PurchaseOrderRepository, productRepo *repository.ProductRepository) *WarehouseService {
	return &WarehouseService{poRepo: poRepo, productRepo: productRepo}
}

func (s *WarehouseService) GetDashboard(storeID uint) (*dto.WarehouseDashboardResponse, error) {
	db := s.poRepo.DB

	// start of today
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	var importOrders int64
	if err := db.Table("purchase_orders").Where("store_id = ? AND created_at >= ?", storeID, start).Count(&importOrders).Error; err != nil {
		return nil, err
	}

	var importedProducts int64
	if err := db.Raw(`
		SELECT COALESCE(SUM(poi.quantity), 0)
		FROM purchase_order_items poi
		JOIN purchase_orders po ON po.id = poi.purchase_order_id
		WHERE po.store_id = ? AND po.created_at >= ?
	`, storeID, start).Scan(&importedProducts).Error; err != nil {
		return nil, err
	}

	var totalAmount float64
	if err := db.Raw(`
		SELECT COALESCE(SUM(total_amount), 0)
		FROM purchase_orders
		WHERE store_id = ? AND created_at >= ?
	`, storeID, start).Scan(&totalAmount).Error; err != nil {
		return nil, err
	}

	// low stock alerts: count products where current_stock <= COALESCE(min_stock, 5)
	var lowStock int64
	if err := s.productRepo.DB.Table("inventories").Select("COUNT(*)").Where("(min_stock IS NOT NULL AND current_stock <= min_stock) OR (min_stock IS NULL AND current_stock <= 5)").Scan(&lowStock).Error; err != nil {
		return nil, err
	}

	res := &dto.WarehouseDashboardResponse{
		ImportOrdersToday:     int(importOrders),
		ImportedProductsToday: importedProducts,
		TotalImportAmount:     totalAmount,
		LowStockAlerts:        int(lowStock),
	}
	return res, nil
}
