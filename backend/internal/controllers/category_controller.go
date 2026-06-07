package controllers

import (
	"net/http"
	"strconv"

	"github.com/PhamGiaKhang2906/sales-management-backend/internal/dto"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/services"
	"github.com/PhamGiaKhang2906/sales-management-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	categoryService *services.CategoryService
}

// NewCategoryController creates a new category controller
func NewCategoryController(categoryService *services.CategoryService) *CategoryController {
	return &CategoryController{
		categoryService: categoryService,
	}
}

// GetAllCategories retrieves all categories
func (ctrl *CategoryController) GetAllCategories(c *gin.Context) {
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	var storeID uint
	switch v := storeVal.(type) {
	case uint:
		storeID = v
	case int:
		storeID = uint(v)
	case float64:
		storeID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	response, err := ctrl.categoryService.GetAllCategories(storeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Lấy danh sách danh mục thành công", response)
}

// CreateCategory creates a new category
func (ctrl *CategoryController) CreateCategory(c *gin.Context) {
	var req dto.CategoryCreateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get storeID from context
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	var storeID uint
	switch v := storeVal.(type) {
	case uint:
		storeID = v
	case int:
		storeID = uint(v)
	case float64:
		storeID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	// Call service
	response, err := ctrl.categoryService.CreateCategory(storeID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Tạo danh mục thành công", response)
}

// UpdateCategory updates an existing category
func (ctrl *CategoryController) UpdateCategory(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	var req dto.CategoryUpdateRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Dữ liệu không hợp lệ: "+err.Error())
		return
	}

	// Get storeID from context
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	var storeID uint
	switch v := storeVal.(type) {
	case uint:
		storeID = v
	case int:
		storeID = uint(v)
	case float64:
		storeID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	// Call service
	response, err := ctrl.categoryService.UpdateCategory(uint(id), storeID, &req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Cập nhật danh mục thành công", response)
}

// DeleteCategory deletes a category by ID
func (ctrl *CategoryController) DeleteCategory(c *gin.Context) {
	// Get ID from URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "ID không hợp lệ")
		return
	}

	// Get storeID from context
	storeVal, exists := c.Get("storeID")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Không có thông tin cửa hàng")
		return
	}

	var storeID uint
	switch v := storeVal.(type) {
	case uint:
		storeID = v
	case int:
		storeID = uint(v)
	case float64:
		storeID = uint(v)
	default:
		utils.ErrorResponse(c, http.StatusUnauthorized, "Thông tin cửa hàng không hợp lệ")
		return
	}

	// Call service
	err = ctrl.categoryService.DeleteCategory(uint(id), storeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Xóa danh mục thành công", nil)
}
