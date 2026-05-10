package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.CourseSectionReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseSectionReviewRepository extends JpaRepository<CourseSectionReview, Long> {
    boolean existsByUser_IdAndCourseSection_CodeAndDeletedAtIsNull(Long userId, String courseSectionCode);

    Optional<CourseSectionReview> findByIdAndDeletedAtIsNull(Long id);

    List<CourseSectionReview> findByUser_IdAndDeletedAtIsNull(Long userId);

    List<CourseSectionReview> findByCourseSection_CodeAndDeletedAtIsNull(String courseSectionCode);
}

