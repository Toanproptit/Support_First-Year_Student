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
import org.example.supportfirststudents.enums.Status;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.PostMapper;
import org.example.supportfirststudents.repository.CategoryRepository;
import org.example.supportfirststudents.repository.PostCategoryRepository;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {

    final PostCategoryRepository postCategoryRepository;
    final CategoryRepository categoryRepository;
    final PostRepository postRepository;
    final UserRepository userRepository;
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
        return postMapper.toPostResponse(savedPost);
    }

    public PostResponse getPostById(Long id) {
        Post post = findPostById(id);
        if (!canReadPost(post)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return postMapper.toPostResponse(post);
    }

    public List<PostResponse> getAllPosts() {
        List<Post> posts = isAdminCaller()
                ? postRepository.findAllWithCategories()
                : postRepository.findAllWithCategoriesByStatus(Status.APPROVED);

        return posts
                .stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());
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
                .results(content)
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
        return postRepository.findAllWithCategoriesByStatus(Status.PENDING)
                .stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());
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
                .results(content)
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
        return postMapper.toPostResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse rejectPost(Long id) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Post post = findPostById(id);
        post.setStatus(Status.REJECTED);
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> getPostsByUserId(Long userId) {

        validateUserExists(userId);

        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return postRepository.findByUserId(userId)
                .stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());
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
                .results(content)
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
        return postMapper.toPostResponse(updatedPost);
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
