package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.FeedbackStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    Long id;
    Long userId;
    String subject;
    String title;
    String content;
    FeedbackStatus status;
    LocalDateTime createdAt;
}
