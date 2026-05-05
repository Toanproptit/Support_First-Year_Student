package org.example.supportfirststudents.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ClassScheduleId implements Serializable {
    Integer lessonNumber;
    String courseSectionCode;
}
