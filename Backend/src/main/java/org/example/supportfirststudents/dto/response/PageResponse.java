package org.example.supportfirststudents.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {
    List<T> results;
    int page;
    int size;
    long totalElements;
    int totalPages;
    boolean first;
    boolean last;
}
