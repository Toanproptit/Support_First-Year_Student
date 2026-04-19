package org.example.supportfirststudents.mapper;


import org.example.supportfirststudents.dto.request.CreatePost;
import org.example.supportfirststudents.dto.request.UpdatePost;
import org.example.supportfirststudents.dto.response.CategoryResponse;
import org.example.supportfirststudents.dto.response.PostResponse;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.enums.Status;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PostMapper {

    public Post toPost(CreatePost request) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(Status.APPROVED);
        return post;
    }

    public PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .status(post.getStatus())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .userId(post.getUser() != null ? post.getUser().getId() : null)
                .userName(post.getUser() != null ? post.getUser().getUserName() : null)
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .categories(mapCategories(post))
                .build();
    }

    public List<CategoryResponse> mapCategories(Post post) {
        if(post.getPostCategories() == null || post.getPostCategories().isEmpty()) {
            return List.of();
        }
        return post.getPostCategories().stream()
                .map(postCategory -> CategoryResponse.builder()
                        .id(postCategory.getCategory().getId())
                        .name(postCategory.getCategory().getName())
                        .slug(postCategory.getCategory().getSlug())
                        .build()
                ).toList();
    }

    public void updatePost(Post post, UpdatePost request) {
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(request.getStatus());
    }
}
