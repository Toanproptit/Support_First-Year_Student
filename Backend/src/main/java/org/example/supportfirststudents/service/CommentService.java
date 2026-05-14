package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateComment;
import org.example.supportfirststudents.dto.request.UpdateComment;
import org.example.supportfirststudents.dto.response.CommentResponse;
import org.example.supportfirststudents.dto.response.CommentTreeResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.entity.Comment;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CommentMapper;
import org.example.supportfirststudents.repository.CommentRepository;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        if (!isAdminCaller() && !isCallerUserId(request.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        // Tìm post và user
        Post post = findPostById(request.getPostId());
        User user = findUserById(request.getUserId());

        // Tạo comment
        Comment comment = commentMapper.toComment(request);
        comment.setUser(user);

        if (request.getParentId() != null) {
            Comment parent = findCommentById(request.getParentId());
            if (parent.getPost() == null || parent.getPost().getId() == null || !parent.getPost().getId().equals(post.getId())) {
                throw new AppException(ErrorCode.INVALID_COMMENT_PARENT);
            }
            comment.setParent(parent);
        }

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

    public PageResponse<CommentResponse> getAllCommentsPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentPage = commentRepository.findAll(pageable);

        List<CommentResponse> content = commentPage.getContent()
                .stream()
                .map(commentMapper::toCommentResponse)
                .toList();

        return PageResponse.<CommentResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .first(commentPage.isFirst())
                .last(commentPage.isLast())
                .build();
    }

    public List<CommentTreeResponse> getCommentsTreeByPostId(Long postId) {
        validatePostExists(postId);

        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        Map<Long, CommentTreeResponse> nodesById = new HashMap<>();

        for (Comment comment : comments) {
            nodesById.put(comment.getId(), commentMapper.toCommentTreeResponse(comment));
        }

        List<CommentTreeResponse> roots = new ArrayList<>();
        for (Comment comment : comments) {
            CommentTreeResponse node = nodesById.get(comment.getId());
            Long parentId = node.getParentId();
            if (parentId == null) {
                roots.add(node);
                continue;
            }
            CommentTreeResponse parentNode = nodesById.get(parentId);
            if (parentNode == null) {
                roots.add(node);
                continue;
            }
            parentNode.getReplies().add(node);
        }

        return roots;
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        // Kiểm tra post có tồn tại không
        validatePostExists(postId);

        return commentRepository.findByPostId(postId)
                .stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<CommentResponse> getCommentsByPostIdPaged(Long postId, int page, int size) {
        validatePostExists(postId);

        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

        List<CommentResponse> content = commentPage.getContent()
                .stream()
                .map(commentMapper::toCommentResponse)
                .toList();

        return PageResponse.<CommentResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .first(commentPage.isFirst())
                .last(commentPage.isLast())
                .build();
    }

    public List<CommentResponse> getCommentsByUserId(Long userId) {
        // Kiểm tra user có tồn tại không
        validateUserExists(userId);

        return commentRepository.findByUserId(userId)
                .stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<CommentResponse> getCommentsByUserIdPaged(Long userId, int page, int size) {
        validateUserExists(userId);

        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> commentPage = commentRepository.findByUserId(userId, pageable);

        List<CommentResponse> content = commentPage.getContent()
                .stream()
                .map(commentMapper::toCommentResponse)
                .toList();

        return PageResponse.<CommentResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .first(commentPage.isFirst())
                .last(commentPage.isLast())
                .build();
    }

    @Transactional
    public CommentResponse updateComment(Long id, UpdateComment request) {
        Comment comment = findCommentById(id);
        if (!canWriteComment(comment)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        commentMapper.updateComment(comment, request);
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = findCommentById(id);
        if (!canWriteComment(comment)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<Comment> replies = commentRepository.findByParentId(id);
        if (!replies.isEmpty()) {
            replies.forEach(r -> r.setParent(null));
            commentRepository.saveAll(replies);
        }

        Post post = comment.getPost();
        if (post != null) {
            post.removeComment(comment);
        }

        commentRepository.delete(comment);
    }

    public Long countCommentsByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }


    private Comment findCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
    }

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void validatePostExists(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    private boolean isCallerUserId(Long userId) {
        User caller = getCallerUser();
        return caller != null && caller.getId() != null && caller.getId().equals(userId);
    }

    private User getCallerUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    private boolean canWriteComment(Comment comment) {
        if (isAdminCaller()) {
            return true;
        }
        User caller = getCallerUser();
        return caller != null && comment.getUser() != null && caller.getId().equals(comment.getUser().getId());
    }

    private boolean isAdminCaller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if ("ROLE_Admin".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    private PageRequest buildPageRequest(int page, int size, Sort sort) {
        int validatePage = Math.max(page, 0);
        int validateSize = size <= 0 ? 10 : Math.min(size, 100);
        return PageRequest.of(validatePage, validateSize, sort);
    }
}
