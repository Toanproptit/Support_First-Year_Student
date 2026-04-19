package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.CategoryResponse;
import org.example.supportfirststudents.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(category.getId(),category.getName(),category.getSlug());
    }
}
