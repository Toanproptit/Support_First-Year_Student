package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentTreeResponse {
    Long id;
    String content;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Long parentId;
    Long postId;
    String postTitle;
    Long userId;
    String userName;

    @Builder.Default
    List<CommentTreeResponse> replies = new ArrayList<>();
}

