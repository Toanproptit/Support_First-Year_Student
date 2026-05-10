package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateCourseSectionReview;
import org.example.supportfirststudents.dto.request.UpdateCourseSectionReview;
import org.example.supportfirststudents.dto.response.CourseSectionReviewResponse;
import org.example.supportfirststudents.entity.CourseSectionReview;
import org.springframework.stereotype.Component;

@Component
public class CourseSectionReviewMapper {
    public CourseSectionReview toEntity(CreateCourseSectionReview request) {
        CourseSectionReview review = new CourseSectionReview();
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        return review;
    }

    public CourseSectionReviewResponse toResponse(CourseSectionReview review) {
        return CourseSectionReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .courseSectionCode(review.getCourseSection() != null ? review.getCourseSection().getCode() : null)
                .subjectCode(review.getCourseSection() != null
                        && review.getCourseSection().getSubject() != null
                        ? review.getCourseSection().getSubject().getCode()
                        : null)
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public void updateEntity(CourseSectionReview review, UpdateCourseSectionReview request) {
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
    }
}

