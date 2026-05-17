package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ParticipationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParticipationResponse {
    Long id;
    Long userId;
    String userName;
    Long activityId;
    LocalDateTime joinDate;
    String role;
    ParticipationStatus status;
    String cancelRequestReason;
    LocalDateTime cancelRequestedAt;
    LocalDateTime cancelReviewedAt;
    String cancelReviewNote;
}
