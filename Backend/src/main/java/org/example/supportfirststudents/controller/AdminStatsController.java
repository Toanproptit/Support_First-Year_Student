package org.example.supportfirststudents.controller;

import org.example.supportfirststudents.dto.response.AdminStatsResponse;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.service.AdminStatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequestMapping("/admin")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminStatsController {
    AdminStatsService adminStatsService;

    @GetMapping("/stats")
    public ApiResponse<AdminStatsResponse> getStats() {
        return ApiResponse.<AdminStatsResponse>builder()
                .result(adminStatsService.getStat())
                .build();
    }
}