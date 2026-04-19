package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateComment;
import org.example.supportfirststudents.dto.request.UpdateComment;
import org.example.supportfirststudents.dto.response.CommentResponse;
import org.example.supportfirststudents.entity.Comment;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.CommentMapper;
import org.example.supportfirststudents.repository.CommentRepository;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {

    CommentRepository commentRepository;
    PostRepository postRepository;
    UserRepository userRepository;
    CommentMapper commentMapper;

    @Transactional
    public CommentResponse createComment(CreateComment request) {
        // Tìm post và user
        Post post = findPostById(request.getPostId());
        User user = findUserById(request.getUserId());

        // Tạo comment
        Comment comment = commentMapper.toComment(request);
        comment.setUser(user);

        post.addComment(comment);

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(savedComment);
    }

    public CommentResponse getCommentById(Long id) {
        Comment comment = findCommentById(id);
        return commentMapper.toCommentResponse(comment);
    }

    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        // Kiểm tra post có tồn tại không
        validatePostExists(postId);

        return commentRepository.findByPostId(postId)
                .stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    public List<CommentResponse> getCommentsByUserId(Long userId) {
        // Kiểm tra user có tồn tại không
        validateUserExists(userId);

        return commentRepository.findByUserId(userId)
                .stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(Long id, UpdateComment request) {
        Comment comment = findCommentById(id);
        commentMapper.updateComment(comment, request);
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = findCommentById(id);

        Post post = comment.getPost();
        if (post != null) {
            post.removeComment(comment);
        }

        commentRepository.delete(comment);
    }

    public Long countCommentsByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    // ✅ Helper methods để tránh lặp code
    private Comment findCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new Appexception(ErrorCode.COMMENT_NOT_FOUND));
    }

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new Appexception(ErrorCode.POST_NOT_FOUND));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Appexception(ErrorCode.USER_NOT_FOUND));
    }

    private void validatePostExists(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new Appexception(ErrorCode.POST_NOT_FOUND);
        }
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new Appexception(ErrorCode.USER_NOT_FOUND);
        }
    }
}
