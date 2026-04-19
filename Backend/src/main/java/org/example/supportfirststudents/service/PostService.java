package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreatePost;
import org.example.supportfirststudents.dto.request.UpdatePost;
import org.example.supportfirststudents.dto.response.PostResponse;
import org.example.supportfirststudents.entity.Category;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.PostCategory;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.PostMapper;
import org.example.supportfirststudents.repository.CategoryRepository;
import org.example.supportfirststudents.repository.PostCategoryRepository;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.UserRepository;
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

        user.addPost(post);

        if(request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            for(Long categoryId : request.getCategoryIds()) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new Appexception(ErrorCode.CATEGORY_NOT_FOUND));
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
        return postMapper.toPostResponse(post);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllWithCategories()
                .stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByUserId(Long userId) {

        validateUserExists(userId);

        return postRepository.findByUserId(userId)
                .stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostResponse updatePost(Long id, UpdatePost request) {
        Post post = findPostById(id);
        postMapper.updatePost(post, request);
        Post updatedPost = postRepository.save(post);
        return postMapper.toPostResponse(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = findPostById(id);

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
                .orElseThrow(() -> new Appexception(ErrorCode.POST_NOT_FOUND));
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Appexception(ErrorCode.USER_NOT_FOUND));
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new Appexception(ErrorCode.USER_NOT_FOUND);
        }
    }
}
