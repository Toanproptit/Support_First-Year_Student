package org.example.supportfirststudents.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "exam_schedule")
public class ExamSchedule {
    @Id
    String id;
    LocalDate examDate;
    LocalTime startTime;
    LocalTime endTime;
    String examRoom;
    String examFormat;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="courseSection_id")
    CourseSection courseSection;
}
