package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long userId);

    Long countByUserId(Long userId);

    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postCategories pc " +
            "LEFT JOIN FETCH pc.category")
    List<Post> findAllWithCategories();
}
