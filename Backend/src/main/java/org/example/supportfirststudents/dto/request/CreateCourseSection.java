package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateCourseSection {
    @NotBlank
    String code;

    String name;

    Integer maxStudents;
    LocalDate startDate;
    LocalDate endDate;

    @NotBlank
    String termCode;

    @NotBlank
    String majorCode;

    @NotBlank
    String subjectCode;

    Long teacherId;
}

