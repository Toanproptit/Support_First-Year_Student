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
import org.example.supportfirststudents.enums.FeedbackStatus;
import org.example.supportfirststudents.exception.AppException;

import org.example.supportfirststudents.mapper.FeedbackMapper;
import org.example.supportfirststudents.repository.FeedbackRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        User user;
        if (isAdminCaller()) {
            if (request.getUserId() == null) {
                throw new AppException(ErrorCode.USER_ID_REQUIRED);
            }
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        } else {
            user = getCallerUser();
            if (user == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        }

        Feedback feedback = feedbackMapper.toFeedback(request);
        feedback.setUser(user);

        return feedbackMapper.toFeedbackResponse(feedbackRepository.save(feedback));
    }

    public FeedbackResponse getFeedbackById(Long id) {
        return feedbackMapper.toFeedbackResponse(findFeedbackById(id));
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .filter(feedback -> feedback.getDeletedAt() == null)
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    public List<FeedbackResponse> getMyFeedbacks() {
        User caller = getCallerUser();
        if (caller == null || caller.getId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return feedbackRepository.findByUserIdAndDeletedAtIsNull(caller.getId()).stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    public List<FeedbackResponse> getFeedbacksByUserId(Long userId) {
        validateUserExists(userId);

        return feedbackRepository.findByUserIdAndDeletedAtIsNull(userId).stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    @Transactional
    public FeedbackResponse updateFeedback(Long id, UpdateFeedback request) {
        Feedback feedback = findFeedbackById(id);
        if (feedback.getStatus() == FeedbackStatus.REVIEWED) {
            throw new AppException(ErrorCode.FEEDBACK_ALREADY_REVIEWED);
        }
        feedbackMapper.updateFeedback(feedback, request);
        return feedbackMapper.toFeedbackResponse(feedbackRepository.save(feedback));
    }

    @Transactional
    public void deleteFeedback(Long id) {

        Feedback feedback = findFeedbackById(id);

        if (!isAdminCaller() && !isCallerUserId(feedback.getUser().getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (isAdminCaller()) {
            feedbackRepository.delete(feedback);
            return;
        }
        feedback.setDeletedAt(LocalDateTime.now());
        feedbackRepository.save(feedback);
    }

    private Feedback findFeedbackById(Long id) {
        return feedbackRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
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

    private boolean isAdminCaller(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || authentication.getAuthorities() == null){
            return false;
        }

        for(GrantedAuthority authority : authentication.getAuthorities()){
            String value = authority.getAuthority();
            if ("ROLE_Admin".equals(value) || "ROLE_ADMIN".equals(value)) {
                return true;
            }
        }
        return false;
    }
}
