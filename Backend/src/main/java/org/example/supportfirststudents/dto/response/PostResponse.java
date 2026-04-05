package org.example.supportfirststudents.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String title;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long userId;
    String userName;
    Integer commentCount;
}
