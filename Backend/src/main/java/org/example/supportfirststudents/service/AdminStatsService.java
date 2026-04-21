package org.example.supportfirststudents.service;

import java.time.LocalDateTime;

import org.example.supportfirststudents.dto.response.AdminStatsResponse;
import org.example.supportfirststudents.repository.CategoryRepository;
import org.example.supportfirststudents.repository.FeedbackRepository;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminStatsService {
    final UserRepository userRepository;
    final FeedbackRepository feedbackRepository;
    final PostRepository postRepository;
    final CategoryRepository categoryRepository;

    public AdminStatsResponse getStat() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalPosts(postRepository.count())
                .totalCategories(categoryRepository.count())
                .newFeedbacks(feedbackRepository.countByCreatedAtAfter(sevenDaysAgo))
                .build();
    }
}