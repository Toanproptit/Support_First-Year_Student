package org.example.supportfirststudents.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ReactionType;


@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateReaction {
    Long userId;
    Long postId;
    ReactionType reactionType;
}
