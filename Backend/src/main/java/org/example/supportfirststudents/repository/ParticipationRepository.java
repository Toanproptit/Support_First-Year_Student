package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Participation;
import org.example.supportfirststudents.enums.ParticipationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    boolean existsByUserIdAndActivityId(Long userId, Long activityId);

    Optional<Participation> findByUserIdAndActivityId(Long userId, Long activityId);

    List<Participation> findByUserId(Long userId);

    List<Participation> findByActivityId(Long activityId);

    @Query("""
            select count(p) from Participation p
            where p.activity.id = :activityId
              and (p.status is null or p.status <> :cancelledStatus)
            """)
    long countNotCancelledByActivityId(
            @Param("activityId") Long activityId,
            @Param("cancelledStatus") ParticipationStatus cancelledStatus
    );
}
