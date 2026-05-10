package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, String> {
    List<CourseSection> findAllByTerm_Code(String termCode, Sort sort);

    List<CourseSection> findAllByMajor_Code(String majorCode, Sort sort);

    List<CourseSection> findAllBySubject_Code(String subjectCode, Sort sort);

    boolean existsBySubject_Code(String subjectCode);

    List<CourseSection> findAllByTerm_CodeAndMajor_Code(String termCode, String majorCode, Sort sort);

    List<CourseSection> findAllByTerm_CodeAndMajor_CodeAndSubject_Code(String termCode, String majorCode, String subjectCode, Sort sort);
}
