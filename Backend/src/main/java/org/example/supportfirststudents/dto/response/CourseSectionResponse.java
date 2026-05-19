package org.example.supportfirststudents.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseSectionResponse {
    String code;
    String name;
    String termCode;
    String majorCode;
    String subjectCode;
    Long teacherId;
    String teacherName;
    Integer maxStudents;
    LocalDate startDate;
    LocalDate endDate;
}
