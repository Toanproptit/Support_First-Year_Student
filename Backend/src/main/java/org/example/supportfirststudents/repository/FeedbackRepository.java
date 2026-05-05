
package org.example.supportfirststudents.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.example.supportfirststudents.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    long countByCreatedAtAfter(LocalDateTime time);

    List<Feedback> findByUserId(Long userId);
}