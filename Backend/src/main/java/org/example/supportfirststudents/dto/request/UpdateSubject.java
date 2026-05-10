package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateSubject {
    String name;

    @Min(0)
    @Max(100)
    Integer finalExamWeight;

    @Min(0)
    @Max(100)
    Integer midtermWeight;

    @Min(0)
    @Max(100)
    Integer attendanceWeight;
}
