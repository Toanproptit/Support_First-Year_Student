package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    boolean existsByUserIdAndActivityId(Long userId, Long activityId);

    Optional<Participation> findByUserIdAndActivityId(Long userId, Long activityId);

    List<Participation> findByUserId(Long userId);

    List<Participation> findByActivityId(Long activityId);
}
