package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreatePost;
import org.example.supportfirststudents.dto.request.UpdatePost;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.dto.response.PostResponse;
import org.example.supportfirststudents.entity.Category;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.PostCategory;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.enums.Role;
import org.example.supportfirststudents.enums.ReactionType;
import org.example.supportfirststudents.enums.Status;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.PostMapper;
import org.example.supportfirststudents.repository.CategoryRepository;
import org.example.supportfirststudents.repository.PostCategoryRepository;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.ReactionRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    final PostCategoryRepository postCategoryRepository;
    final CategoryRepository categoryRepository;
    final PostRepository postRepository;
    final UserRepository userRepository;
    final ReactionRepository reactionRepository;
    final PostMapper postMapper;

    @Transactional
    public PostResponse createPost(CreatePost request) {

        User user = findUserById(request.getUserId());

        Post post = postMapper.toPost(request);
        post.setStatus(user.getRole() == Role.Admin ? Status.APPROVED : Status.PENDING);

        user.addPost(post);

        if(request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            for(Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
                PostCategory postCategory = new PostCategory();

                postCategory.setCategory(category);
                postCategory.setPost(post);

                post.addPostCategory(postCategory);
            }
        }


        Post savedPost = postRepository.save(post);
        return enrichReactions(postMapper.toPostResponse(savedPost), savedPost);
    }

    public PostResponse getPostById(Long id) {
        Post post = findPostById(id);
        if (!canReadPost(post)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return enrichReactions(postMapper.toPostResponse(post), post);
    }

    public List<PostResponse> getAllPosts() {
        List<Post> posts = isAdminCaller()
                ? postRepository.findAllWithCategories()
                : postRepository.findAllWithCategoriesByStatus(Status.APPROVED);

        return enrichReactions(posts);
    }

    public PageResponse<PostResponse> getAllPostsPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Post> postPage = isAdminCaller()
                ? postRepository.findAll(pageable)
                : postRepository.findByStatus(Status.APPROVED, pageable);

        List<PostResponse> content = postPage.getContent()
                .stream()
                .map(postMapper::toPostResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .results(enrichReactions(content, postPage.getContent()))
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .first(postPage.isFirst())
                .last(postPage.isLast())
                .build();
    }

    public List<PostResponse> getPendingPosts() {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        List<Post> posts = postRepository.findAllWithCategoriesByStatus(Status.PENDING);
        return enrichReactions(posts);
    }

    public PageResponse<PostResponse> getPendingPostsPaged(int page, int size) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postPage = postRepository.findByStatus(Status.PENDING, pageable);

        List<PostResponse> content = postPage.getContent()
                .stream()
                .map(postMapper::toPostResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .results(enrichReactions(content, postPage.getContent()))
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .first(postPage.isFirst())
                .last(postPage.isLast())
                .build();
    }

    @Transactional
    public PostResponse approvePost(Long id) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Post post = findPostById(id);
        post.setStatus(Status.APPROVED);
        Post saved = postRepository.save(post);
        return enrichReactions(postMapper.toPostResponse(saved), saved);
    }

    @Transactional
    public PostResponse rejectPost(Long id) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Post post = findPostById(id);
        post.setStatus(Status.REJECTED);
        Post saved = postRepository.save(post);
        return enrichReactions(postMapper.toPostResponse(saved), saved);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {

        validateUserExists(userId);

        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<Post> posts = postRepository.findByUserId(userId);
        return enrichReactions(posts);
    }

    public PageResponse<PostResponse> getPostsByUserIdPaged(Long userId, int page, int size) {
        validateUserExists(userId);

        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> postPage = postRepository.findByUserId(userId, pageable);

        List<PostResponse> content = postPage.getContent()
                .stream()
                .map(postMapper::toPostResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .results(enrichReactions(content, postPage.getContent()))
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .first(postPage.isFirst())
                .last(postPage.isLast())
                .build();
    }

    @Transactional
    public PostResponse updatePost(Long id, UpdatePost request) {
        Post post = findPostById(id);
        if (!canWritePost(post)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (isAdminCaller()) {
            postMapper.updatePost(post, request);
        } else {
            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
        }
        Post updatedPost = postRepository.save(post);
        return enrichReactions(postMapper.toPostResponse(updatedPost), updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = findPostById(id);
        if (!canWritePost(post)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        User user = post.getUser();
        if (user != null) {
            user.removePost(post);
        }

        postRepository.delete(post);
    }

    public Long countPostsByUserId(Long userId) {
        return postRepository.countByUserId(userId);
    }

    private List<PostResponse> enrichReactions(List<Post> posts) {
        List<PostResponse> responses = posts.stream().map(postMapper::toPostResponse).toList();
        return enrichReactions(responses, posts);
    }

    private List<PostResponse> enrichReactions(List<PostResponse> responses, List<Post> posts) {
        if (responses == null || responses.isEmpty() || posts == null || posts.isEmpty()) {
            return responses;
        }

        List<Long> postIds = posts.stream().map(Post::getId).toList();
        Map<Long, Integer> likeCountByPostId = loadLikeCounts(postIds);
        Set<Long> likedPostIds = loadLikedPostIdsByCaller(postIds);

        for (PostResponse response : responses) {
            if (response == null || response.getId() == null) continue;
            Long postId = response.getId();
            response.setLikeCount(likeCountByPostId.getOrDefault(postId, 0));
            response.setLikedByMe(likedPostIds.contains(postId));
        }

        return responses;
    }

    private PostResponse enrichReactions(PostResponse response, Post post) {
        if (response == null || post == null || post.getId() == null) {
            return response;
        }
        Map<Long, Integer> likeCounts = loadLikeCounts(List.of(post.getId()));
        Set<Long> likedPostIds = loadLikedPostIdsByCaller(List.of(post.getId()));
        response.setLikeCount(likeCounts.getOrDefault(post.getId(), 0));
        response.setLikedByMe(likedPostIds.contains(post.getId()));
        return response;
    }

    private Map<Long, Integer> loadLikeCounts(List<Long> postIds) {
        if (postIds == null || postIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, Integer> result = new HashMap<>();
        List<Object[]> rows = reactionRepository.countByPostIdsAndType(postIds, ReactionType.LIKE);
        if (rows == null) return result;
        for (Object[] row : rows) {
            if (row == null || row.length < 2) continue;
            Long postId = (Long) row[0];
            Long count = (Long) row[1];
            if (postId != null && count != null) {
                result.put(postId, Math.toIntExact(count));
            }
        }
        return result;
    }

    private Set<Long> loadLikedPostIdsByCaller(List<Long> postIds) {
        if (postIds == null || postIds.isEmpty()) {
            return Set.of();
        }
        User caller = getCallerUser();
        if (caller == null || caller.getId() == null) {
            return Set.of();
        }
        List<Long> likedIds = reactionRepository.findPostIdsByUserAndType(caller.getId(), postIds, ReactionType.LIKE);
        return likedIds == null ? Set.of() : Set.copyOf(likedIds);
    }


    private Post findPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
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

    private boolean canReadPost(Post post) {
        if (isAdminCaller()) {
            return true;
        }
        User caller = getCallerUser();
        if (caller != null && post.getUser() != null && caller.getId().equals(post.getUser().getId())) {
            return true;
        }
        return post.getStatus() == Status.APPROVED;
    }

    private boolean canWritePost(Post post) {
        if (isAdminCaller()) {
            return true;
        }
        User caller = getCallerUser();
        return caller != null && post.getUser() != null && caller.getId().equals(post.getUser().getId());
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
