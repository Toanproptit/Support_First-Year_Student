package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateCourseSectionReview;
import org.example.supportfirststudents.dto.request.UpdateCourseSectionReview;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CourseSectionReviewResponse;
import org.example.supportfirststudents.service.CourseSectionReviewService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/course-section-reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionReviewController {
    CourseSectionReviewService reviewService;

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @PostMapping
    public ApiResponse<CourseSectionReviewResponse> create(@Valid @RequestBody CreateCourseSectionReview request) {
        return ApiResponse.<CourseSectionReviewResponse>builder()
                .result(reviewService.create(request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @GetMapping("/{id}")
    public ApiResponse<CourseSectionReviewResponse> getById(@PathVariable Long id) {
        return ApiResponse.<CourseSectionReviewResponse>builder()
                .result(reviewService.getById(id))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @GetMapping("/me")
    public ApiResponse<List<CourseSectionReviewResponse>> getMyReviews() {
        return ApiResponse.<List<CourseSectionReviewResponse>>builder()
                .result(reviewService.getMyReviews())
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @GetMapping
    public ApiResponse<List<CourseSectionReviewResponse>> getByCourseSection(@RequestParam String courseSectionCode) {
        return ApiResponse.<List<CourseSectionReviewResponse>>builder()
                .result(reviewService.getByCourseSection(courseSectionCode))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @PutMapping("/{id}")
    public ApiResponse<CourseSectionReviewResponse> update(@PathVariable Long id,
                                                          @Valid @RequestBody UpdateCourseSectionReview request) {
        return ApiResponse.<CourseSectionReviewResponse>builder()
                .result(reviewService.update(id, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Course section review deleted successfully")
                .build();
    }
}
