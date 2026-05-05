package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExamScheduleReposiotory extends JpaRepository<ExamSchedule, String> {

    @Query("""
        select e
        from ExamSchedule e
          where exists (
              select 1
              from StudentCourseSection scs
              where scs.courseSection = e.courseSection
                and scs.user.id = :userId
          )
        order by e.examDate asc, e.startTime asc
    """)
    List<ExamSchedule> findCurrentExamSchedulesByUserId(
            @Param("userId") Long userId
    );
}
