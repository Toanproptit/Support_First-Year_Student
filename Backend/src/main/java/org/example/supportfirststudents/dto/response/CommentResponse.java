package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long postId;
    String postTitle;
    Long userId;
    String userName;
}
