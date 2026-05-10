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
                .termCode(courseSection.getTerm() != null ? courseSection.getTerm().getCode() : null)
                .majorCode(courseSection.getMajor() != null ? courseSection.getMajor().getCode() : null)
                .subjectCode(courseSection.getSubject() != null ? courseSection.getSubject().getCode() : null)
                .teacherId(courseSection.getTeacher() != null ? courseSection.getTeacher().getId() : null)
                .build();
    }
}
