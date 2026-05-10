package org.example.supportfirststudents.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseSectionReviewResponse {
    Long id;
    Long userId;
    String courseSectionCode;
    String subjectCode;
    Integer rating;
    String title;
    String content;
    LocalDateTime createdAt;
}

