package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, String> {
}
