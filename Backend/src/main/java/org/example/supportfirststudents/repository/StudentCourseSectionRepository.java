package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.StudentCourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentCourseSectionRepository extends JpaRepository<StudentCourseSection, Long> {
    boolean existsByUser_IdAndCourseSection_Code(Long userId, String courseSectionCode);

    void deleteByUser_IdAndCourseSection_Code(Long userId, String courseSectionCode);

    java.util.List<StudentCourseSection> findByUser_Id(Long userId);

    java.util.List<StudentCourseSection> findByCourseSection_Code(String courseSectionCode);
}
