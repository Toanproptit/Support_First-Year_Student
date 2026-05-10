package org.example.supportfirststudents.controller;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.CreateCategory;
import org.example.supportfirststudents.dto.request.UpdateCategory;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CategoryResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.service.CategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('Admin','Student')")

public class CategoryController {

    private final CategoryService categoryService;


    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .message("Lấy danh sách danh mục thành công")
                .result(categoryService.getAllCategories()) // Đưa dữ liệu vào field result
                .build();
    }

    // 2. TẠO: Chỉ ADMIN
    @GetMapping("/page")
    public ApiResponse<PageResponse<CategoryResponse>> getAllCategoriesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CategoryResponse>>builder()
                .code(200)
                .message("Success")
                .result(categoryService.getAllCategoriesPaged(page, size))
                .build();
    }

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CreateCategory request) {
        return ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Tạo danh mục mới thành công")
                .result(categoryService.create(request))
                .build();
    }

    // 3. SỬA: Chỉ ADMIN
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody UpdateCategory request) {
        return ApiResponse.<CategoryResponse>builder()
                .code(200)
                .message("Cập nhật danh mục thành công")
                .result(categoryService.update(id, request))
                .build();
    }

    // 4. XÓA: Chỉ ADMIN
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa danh mục thành công")
                .build();
    }
}
