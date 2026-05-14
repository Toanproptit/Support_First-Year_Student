package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Reaction;
import org.example.supportfirststudents.enums.ReactionType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ReactionRepository extends JpaRepository<Reaction,Long> {
    Optional<Reaction> findByUserIdAndPostId(long userId, long postId);
    void deleteByUserIdAndPostId(long userId, long postId);
    Long countByPostId(long postId);
    Long countByPostIdAndType(long postId, ReactionType type);
    List<Reaction> findAllByPostId(long postId , ReactionType reactionType);
    List<Reaction> findByPostId(long postId);

    @Query("""
            select r.post.id, count(r)
            from Reaction r
            where r.type = :type and r.post.id in :postIds
            group by r.post.id
            """)
    List<Object[]> countByPostIdsAndType(@Param("postIds") List<Long> postIds, @Param("type") ReactionType type);

    @Query("""
            select r.post.id
            from Reaction r
            where r.user.id = :userId and r.type = :type and r.post.id in :postIds
            """)
    List<Long> findPostIdsByUserAndType(
            @Param("userId") Long userId,
            @Param("postIds") List<Long> postIds,
            @Param("type") ReactionType type
    );
}
