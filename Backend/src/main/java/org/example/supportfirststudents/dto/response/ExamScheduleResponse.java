package org.example.supportfirststudents.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.cglib.core.Local;

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
@FieldDefaults(level = AccessLevel.PRIVATE )
public class ExamScheduleResponse {
    LocalDate examDate;
    LocalTime startTime;
    LocalTime endTime;
    String examRoom;
    String examFormat;
    String subjectName;
}
