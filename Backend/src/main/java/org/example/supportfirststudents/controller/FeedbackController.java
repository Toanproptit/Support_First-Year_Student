package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateFeedback;
import org.example.supportfirststudents.dto.request.UpdateFeedback;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.FeedbackResponse;
import org.example.supportfirststudents.service.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackController {

    FeedbackService feedbackService;

    @PostMapping
    public ApiResponse<FeedbackResponse> createFeedback(@Valid @RequestBody CreateFeedback request) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedbackService.createFeedback(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedbackService.getFeedbackById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedbackService.getAllFeedbacks())
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<FeedbackResponse>> getFeedbacksByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedbackService.getFeedbacksByUserId(userId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<FeedbackResponse> updateFeedback(@PathVariable Long id, @Valid @RequestBody UpdateFeedback request) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedbackService.updateFeedback(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ApiResponse.<Void>builder()
                .message("Feedback deleted successfully")
                .build();
    }
}
