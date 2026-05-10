package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreateCategory;
import org.example.supportfirststudents.dto.request.UpdateCategory;
import org.example.supportfirststudents.dto.response.CategoryResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.entity.Category;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CategoryMapper;
import org.example.supportfirststudents.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryService {

    final CategoryRepository categoryRepository;
    final CategoryMapper categoryMapper;


    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper :: toCategoryResponse).toList();
    }

    public PageResponse<CategoryResponse> getAllCategoriesPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryResponse> content = categoryPage.getContent()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        return PageResponse.<CategoryResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .first(categoryPage.isFirst())
                .last(categoryPage.isLast())
                .build();
    }

    public CategoryResponse create(CreateCategory request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse update(Long id,UpdateCategory request) {
        Category category = getCategory(id);
        category.setName(request.getName());
        category.setSlug(request.getSlug());

        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category getCategory(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private PageRequest buildPageRequest(int page, int size, Sort sort) {
        int validatePage = Math.max(page, 0);
        int validateSize = size <= 0 ? 10 : Math.min(size, 100);
        return PageRequest.of(validatePage, validateSize, sort);
    }
    
}
