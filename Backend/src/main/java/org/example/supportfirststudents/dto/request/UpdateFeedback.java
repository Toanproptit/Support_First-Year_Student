package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.FeedbackStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateFeedback {

    @NotNull
    FeedbackStatus status;
}
