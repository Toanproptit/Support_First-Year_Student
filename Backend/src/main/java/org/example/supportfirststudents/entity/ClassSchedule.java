package org.example.supportfirststudents.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "class_schedules")
public class ClassSchedule {
    @EmbeddedId
    ClassScheduleId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseSectionCode")
    @JoinColumn(name = "course_section_code")
    CourseSection courseSection;

    String dayOfWeek;
    LocalTime startTime;
    LocalTime endTime;
    LocalDate classDate;
    String room;
}
