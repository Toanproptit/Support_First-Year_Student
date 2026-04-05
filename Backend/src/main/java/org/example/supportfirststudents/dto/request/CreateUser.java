package org.example.supportfirststudents.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.Role;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUser {

    @NotBlank(message = "fullName cannot be blank")
    String fullName;

    @NotBlank(message = "username cannot be blank")
    String username;

    @NotBlank(message = "password cannot be blank")
    @Size(min = 6 , message = "password must be at least 6 characters")
    String password;

    @NotBlank(message = "email invalid")
    @Email(message = "email invalid")
    String email;

    Role role;
}
