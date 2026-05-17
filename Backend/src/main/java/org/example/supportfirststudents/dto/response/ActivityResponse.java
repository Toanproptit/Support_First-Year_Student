package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ActivityStatus;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActivityResponse {
    Long id;
    String name;
    Date startDate;
    Date endDate;
    String address;
    ActivityStatus status;
    String description;

    Integer studentQuantity;
    Integer participantCount;
    List<ParticipationResponse> participations;
}
