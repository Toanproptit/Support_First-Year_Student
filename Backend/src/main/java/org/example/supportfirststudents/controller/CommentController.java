package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateComment;
import org.example.supportfirststudents.dto.request.UpdateComment;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CommentResponse;
import org.example.supportfirststudents.dto.response.CommentTreeResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.service.CommentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@PreAuthorize("hasAnyRole('Admin','Student')")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {

    CommentService commentService;

    @PostMapping
    public ApiResponse<CommentResponse> createComment(@Valid @RequestBody CreateComment request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.createComment(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CommentResponse> getCommentById(@PathVariable Long id) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.getCommentById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CommentResponse>> getAllComments() {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getAllComments())
                .build();
    }

    @GetMapping("/page")
    public ApiResponse<PageResponse<CommentResponse>> getAllCommentsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getAllCommentsPaged(page, size))
                .build();
    }

    @GetMapping("/post/{postId}")
    public ApiResponse<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getCommentsByPostId(postId))
                .build();
    }

    @GetMapping("/post/{postId}/tree")
    public ApiResponse<List<CommentTreeResponse>> getCommentsTreeByPostId(@PathVariable Long postId) {
        return ApiResponse.<List<CommentTreeResponse>>builder()
                .result(commentService.getCommentsTreeByPostId(postId))
                .build();
    }

    @GetMapping("/post/{postId}/page")
    public ApiResponse<PageResponse<CommentResponse>> getCommentsByPostIdPaged(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getCommentsByPostIdPaged(postId, page, size))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<CommentResponse>> getCommentsByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getCommentsByUserId(userId))
                .build();
    }

    @GetMapping("/user/{userId}/page")
    public ApiResponse<PageResponse<CommentResponse>> getCommentsByUserIdPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CommentResponse>>builder()
                .result(commentService.getCommentsByUserIdPaged(userId, page, size))
                .build();
    }

    @GetMapping("/post/{postId}/count")
    public ApiResponse<Long> countCommentsByPostId(@PathVariable Long postId) {
        return ApiResponse.<Long>builder()
                .result(commentService.countCommentsByPostId(postId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateComment request) {
        return ApiResponse.<CommentResponse>builder()
                .result(commentService.updateComment(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ApiResponse.<Void>builder()
                .message("Comment deleted successfully")
                .build();
    }
}
