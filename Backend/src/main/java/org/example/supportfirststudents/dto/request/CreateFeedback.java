package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class CreateFeedback {
    @NotBlank
    String subject;

    @NotBlank
    String title;

    @NotBlank
    String content;

    @jakarta.validation.constraints.NotNull
    Long userId;
}
