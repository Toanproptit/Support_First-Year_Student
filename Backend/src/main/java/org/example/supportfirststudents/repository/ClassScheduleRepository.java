package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.ClassSchedule;
import org.example.supportfirststudents.entity.ClassScheduleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, ClassScheduleId> {
    @Query("""
        select cs
        from ClassSchedule cs
        where exists (
            select 1
            from StudentCourseSection scs
            where scs.courseSection = cs.courseSection
              and scs.user.id = :userId
        )
        order by cs.classDate asc, cs.startTime asc
    """)
    List<ClassSchedule> findClassSchedulesByUserId(@Param("userId") Long userId);
}
