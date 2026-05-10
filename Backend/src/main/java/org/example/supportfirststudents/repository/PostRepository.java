package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    Page<Post> findByUserId(Long userId, Pageable pageable);

    Long countByUserId(Long userId);

    List<Post> findByStatus(Status status);

    Page<Post> findByStatus(Status status, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postCategories pc " +
            "LEFT JOIN FETCH pc.category")
    List<Post> findAllWithCategories();

    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postCategories pc " +
            "LEFT JOIN FETCH pc.category " +
            "WHERE p.status = :status")
    List<Post> findAllWithCategoriesByStatus(Status status);
}
