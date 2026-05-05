package org.example.supportfirststudents.controller;

import java.util.List;

import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.ExamScheduleResponse;
import org.example.supportfirststudents.service.ExamScheduleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/exam-schedules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamScheduleController {
    ExamScheduleService examScheduleService;

    @GetMapping("/users/{userId}")
    public ApiResponse<List<ExamScheduleResponse>> getCurrentExamSchedulesByUser(@PathVariable Long userId) {
        return ApiResponse.<List<ExamScheduleResponse>>builder()
                .result(examScheduleService.getExamSchedule(userId))
                .build();
    }
}
