package org.example.supportfirststudents.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.entity.Category;
import org.example.supportfirststudents.enums.Status;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String title;
    String content;
    Status status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long userId;
    String userName;
    Integer commentCount;
    List<CategoryResponse> categories;
}
