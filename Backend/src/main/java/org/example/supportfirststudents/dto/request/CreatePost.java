package org.example.supportfirststudents.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreatePost {
    @NotBlank(message = "Title không được để trống")
    String title;

    @NotBlank(message = "Content không được để trống")
    String content;

    @NotNull(message = "User ID không được để trống")
    Long userId;

    List<Long> categoryIds ;
}
