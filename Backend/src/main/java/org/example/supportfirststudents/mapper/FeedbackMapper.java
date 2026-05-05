package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateFeedback;
import org.example.supportfirststudents.dto.request.UpdateFeedback;
import org.example.supportfirststudents.dto.response.FeedbackResponse;
import org.example.supportfirststudents.entity.Feedback;
import org.example.supportfirststudents.enums.FeedbackStatus;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public Feedback toFeedback(CreateFeedback request) {
        Feedback feedback = new Feedback();
        feedback.setSubject(request.getSubject());
        feedback.setTitle(request.getTitle());
        feedback.setContent(request.getContent());
        feedback.setStatus(FeedbackStatus.VIEW);
        return feedback;
    }

    public FeedbackResponse toFeedbackResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .userId(feedback.getUser() != null ? feedback.getUser().getId() : null)
                .subject(feedback.getSubject())
                .title(feedback.getTitle())
                .content(feedback.getContent())
                .status(feedback.getStatus())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

    public void updateFeedback(Feedback feedback, UpdateFeedback request) {
        feedback.setStatus(request.getStatus());
    }
}
