package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    public UserResponse toUserResponse(User user) {
        String majorCode = user.getMajor() == null ? null : user.getMajor().getCode();
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUserName(),
                user.getEmail(),
                majorCode,
                user.getRole()
        );
    }

    public List<UserResponse> toUserResponse(List<User> users) {
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
}
