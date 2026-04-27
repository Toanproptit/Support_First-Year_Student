package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.entity.CourseSection;
import org.springframework.stereotype.Component;

@Component
public class CourseSectionMapper {
    public CourseSectionResponse toCourseSectionResponse(CourseSection courseSection) {
        return CourseSectionResponse.builder()
                .code(courseSection.getCode())
                .name(courseSection.getName())
                .build();
    }
}
