package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.StudentCourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentCourseSectionRepository extends JpaRepository<StudentCourseSection, Long> {
}
