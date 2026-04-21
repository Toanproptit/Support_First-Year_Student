package org.example.supportfirststudents.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    Long totalUsers;
    Long totalPosts;
    Long totalCategories;
    Long newFeedbacks;
}
