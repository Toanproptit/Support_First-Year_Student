package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateComment;
import org.example.supportfirststudents.dto.request.UpdateComment;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CommentResponse;
import org.example.supportfirststudents.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
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

    @GetMapping("/post/{postId}")
    public ApiResponse<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getCommentsByPostId(postId))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<CommentResponse>> getCommentsByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentService.getCommentsByUserId(userId))
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
