package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateFeedback;
import org.example.supportfirststudents.dto.request.UpdateFeedback;
import org.example.supportfirststudents.dto.response.FeedbackResponse;
import org.example.supportfirststudents.entity.Feedback;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.FeedbackMapper;
import org.example.supportfirststudents.repository.FeedbackRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {

    FeedbackRepository feedbackRepository;
    UserRepository userRepository;
    FeedbackMapper feedbackMapper;

    @Transactional
    public FeedbackResponse createFeedback(CreateFeedback request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Appexception(ErrorCode.USER_NOT_FOUND));

        Feedback feedback = feedbackMapper.toFeedback(request);
        feedback.setUser(user);

        return feedbackMapper.toFeedbackResponse(feedbackRepository.save(feedback));
    }

    public FeedbackResponse getFeedbackById(Long id) {
        return feedbackMapper.toFeedbackResponse(findFeedbackById(id));
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    public List<FeedbackResponse> getFeedbacksByUserId(Long userId) {
        validateUserExists(userId);

        return feedbackRepository.findByUserId(userId).stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    @Transactional
    public FeedbackResponse updateFeedback(Long id, UpdateFeedback request) {
        Feedback feedback = findFeedbackById(id);
        feedbackMapper.updateFeedback(feedback, request);
        return feedbackMapper.toFeedbackResponse(feedbackRepository.save(feedback));
    }

    @Transactional
    public void deleteFeedback(Long id) {
        Feedback feedback = findFeedbackById(id);
        feedbackRepository.delete(feedback);
    }

    private Feedback findFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new Appexception(ErrorCode.FEEDBACK_NOT_FOUND));
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new Appexception(ErrorCode.USER_NOT_FOUND);
        }
    }
}
