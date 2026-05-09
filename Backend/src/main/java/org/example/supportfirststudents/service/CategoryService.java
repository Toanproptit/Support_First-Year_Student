package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreateCategory;
import org.example.supportfirststudents.dto.request.UpdateCategory;
import org.example.supportfirststudents.dto.response.CategoryResponse;
import org.example.supportfirststudents.entity.Category;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CategoryMapper;
import org.example.supportfirststudents.repository.CategoryRepository;
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

    
}
