package org.example.supportfirststudents.controller;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.CreateUser;
import org.example.supportfirststudents.dto.request.UpdateUser;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe() {
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(userService.getMe())
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getUser(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size)
    {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .code(200)
                .message("Success")
                .result(userService.findAll(page, size))
                .build();
    }


    @PreAuthorize("hasAnyRole('Admin')")
    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody CreateUser request){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(userService.create(request))
                .build();
    }


    @PreAuthorize("hasAnyRole('Admin')")
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable Long id , @RequestBody UpdateUser request){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Update Success")
                .result(userService.update(id,request))
                .build();
    }


    @PreAuthorize("hasAnyRole('Admin')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id){
        userService.delete(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Delete Success")
                .build();
    }
}
