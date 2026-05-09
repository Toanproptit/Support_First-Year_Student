package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreatePost;
import org.example.supportfirststudents.dto.request.UpdatePost;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.PostResponse;
import org.example.supportfirststudents.service.PostService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@PreAuthorize("hasAnyRole('Admin','Student')")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@Valid @RequestBody CreatePost request) {
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Successfully created post")
                .result(postService.createPost(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getPostById(@PathVariable Long id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPostById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PostResponse>> getAllPosts() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getAllPosts())
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping("/pending")
    public ApiResponse<List<PostResponse>> getPendingPosts() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPendingPosts())
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}/approve")
    public ApiResponse<PostResponse> approvePost(@PathVariable Long id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.approvePost(id))
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}/reject")
    public ApiResponse<PostResponse> rejectPost(@PathVariable Long id) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.rejectPost(id))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<PostResponse>> getPostsByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPostsByUserId(userId))
                .build();
    }

    @GetMapping("/user/{userId}/count")
    public ApiResponse<Long> countPostsByUserId(@PathVariable Long userId) {
        return ApiResponse.<Long>builder()
                .result(postService.countPostsByUserId(userId))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @PutMapping("/{id}")
    public ApiResponse<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePost request) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.updatePost(id, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ApiResponse.<Void>builder()
                .message("Post deleted successfully")
                .build();
    }
}
