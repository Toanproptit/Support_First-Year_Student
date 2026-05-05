package org.example.supportfirststudents.controller;

import java.util.List;

import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.ClassScheduleResponse;
import org.example.supportfirststudents.service.ClassScheduleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/class-schedules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassScheduleController {
    ClassScheduleService classScheduleService;

    @GetMapping("/users/{userId}")
    public ApiResponse<List<ClassScheduleResponse>> getClassSchedulesByUser(@PathVariable Long userId) {
        return ApiResponse.<List<ClassScheduleResponse>>builder()
                .result(classScheduleService.getClassSchedulesByUser(userId))
                .build();
    }
}
