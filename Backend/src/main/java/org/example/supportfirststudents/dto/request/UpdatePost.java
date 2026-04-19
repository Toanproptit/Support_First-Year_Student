package org.example.supportfirststudents.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.Status;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePost {

    @NotBlank(message = "Title không được để trống")
    String title;

    @NotBlank(message = "Content không được để trống")
    String content;

    @NotBlank
    Status status;
}
