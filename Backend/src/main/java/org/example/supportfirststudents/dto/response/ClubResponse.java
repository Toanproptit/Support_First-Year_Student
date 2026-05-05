package org.example.supportfirststudents.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClubResponse {
    Long id;
    String name;
    String linkFacebook;
    String linkYoutube;
    String linkWeb;
    String image;
    String description;
    String head;
}
