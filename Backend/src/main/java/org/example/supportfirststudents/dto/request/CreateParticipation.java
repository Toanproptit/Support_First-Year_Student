package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateParticipation {

    @NotNull
    Long userId;

    @NotNull
    Long activityId;

    String role;
}
