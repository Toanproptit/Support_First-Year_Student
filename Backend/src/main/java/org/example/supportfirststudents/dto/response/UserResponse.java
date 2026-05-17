package org.example.supportfirststudents.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.Role;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id ;
    String fullName;
    String userName;
    String email;
    String majorCode;
    Role role;
}
