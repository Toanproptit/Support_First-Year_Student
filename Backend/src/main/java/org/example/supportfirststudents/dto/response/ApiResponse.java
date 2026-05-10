package org.example.supportfirststudents.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse<T> {
    @Builder.Default
    public Integer code = 200;

    @Builder.Default
    public String message = "Success";

    public T result;

}
