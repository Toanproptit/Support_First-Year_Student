package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateComment {

    @NotBlank(message = "Content không được để trống")
    String content;

    @NotNull(message = "Post ID không được để trống")
    Long postId;

    @NotNull(message = "User ID không được để trống")
    Long userId;
}
