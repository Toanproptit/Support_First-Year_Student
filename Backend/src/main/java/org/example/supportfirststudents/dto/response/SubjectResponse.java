package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectResponse {
    String code;
    String name;
    Integer finalExamWeight;
    Integer midtermWeight;
    Integer attendanceWeight;
}
