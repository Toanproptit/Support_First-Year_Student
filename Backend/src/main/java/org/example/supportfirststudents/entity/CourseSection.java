package org.example.supportfirststudents.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
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

    String name;

    Integer maxStudents;
    LocalDate startDate;
    LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "term_code")
    Term term;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_code")
    Major major;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_code")  
    Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    User teacher;
}
