package org.example.supportfirststudents.controller;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.LoginRequest;
import org.example.supportfirststudents.dto.request.RegisterRequest;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.AuthResponse;
import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest registerRequest)  {
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Register Successfully!")
                .result(authService.register(registerRequest))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest loginRequest)  {
        return ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("login success!")
                .result(authService.login(loginRequest))
                .build();
    }
}
