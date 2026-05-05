package org.example.supportfirststudents.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateClub {
    @NotBlank
    String name;

    @NotBlank
    String linkFacebook;
    String linkYoutube;
    String linkWeb;

    @NotBlank
    String image;

    @NotBlank
    String description;

    @NotBlank
    String head;
}
