package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ActivityStatus;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateActivity {

    @NotBlank
    String name;

    @NotNull
    Date startDate;

    @NotNull
    Date endDate;

    String address;

    ActivityStatus status;

    String description;
}
