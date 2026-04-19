package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Reaction;
import org.example.supportfirststudents.enums.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ReactionRepository extends JpaRepository<Reaction,Long> {
    Optional<Reaction> findByUserIdAndPostId(long userId, long postId);
    void deleteByUserIdAndPostId(long userId, long postId);
    Long countByPostId(long postId);
    Long countByPostIdAndType(long postId, String type);
    List<Reaction> findAllByPostId(long postId , ReactionType reactionType);
    List<Reaction> findByPostId(long postId);
}
