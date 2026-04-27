package org.example.supportfirststudents.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "course_sections")
public class CourseSection {
    @Id
    String code;
    Integer maxStudents;
    LocalDate startDate;
    LocalDate endDate;
    String semester;
    @ManyToOne
    @JoinColumn(name = "subject_code")  
    Subject subject;
}
