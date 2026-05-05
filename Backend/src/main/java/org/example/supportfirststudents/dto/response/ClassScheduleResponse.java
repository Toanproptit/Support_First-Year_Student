package org.example.supportfirststudents.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassScheduleResponse {
    Integer lessonNumber;
    String courseSectionCode;
    String subjectName;
    LocalDate classDate;
    String dayOfWeek;
    LocalTime startTime;
    LocalTime endTime;
    String room;
}
