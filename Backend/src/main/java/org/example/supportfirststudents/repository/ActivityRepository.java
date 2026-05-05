package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("select distinct a from Activity a left join fetch a.participations p left join fetch p.user where a.id = :id")
    Optional<Activity> findByIdWithParticipations(@Param("id") Long id);

    @Query("select distinct a from Activity a left join fetch a.participations p left join fetch p.user")
    List<Activity> findAllWithParticipations();
}
