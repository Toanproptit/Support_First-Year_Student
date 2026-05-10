package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostId(Long postId);

    Page<Comment> findByPostId(Long postId, Pageable pageable);


    List<Comment> findByUserId(Long userId);

    Page<Comment> findByUserId(Long userId, Pageable pageable);


    Long countByPostId(Long postId);
}
