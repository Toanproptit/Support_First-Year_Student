package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateActivity;
import org.example.supportfirststudents.dto.request.UpdateActivity;
import org.example.supportfirststudents.dto.response.ActivityResponse;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.service.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActivityController {

    ActivityService activityService;

    @PostMapping
    public ApiResponse<ActivityResponse> createActivity(@Valid @RequestBody CreateActivity request) {
        return ApiResponse.<ActivityResponse>builder()
                .code(200)
                .message("Successfully created activity")
                .result(activityService.createActivity(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ActivityResponse> getActivityById(@PathVariable Long id) {
        return ApiResponse.<ActivityResponse>builder()
                .code(200)
                .message("Successfully retrieved activity")
                .result(activityService.getActivityById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ActivityResponse>> getAllActivities() {
        return ApiResponse.<List<ActivityResponse>>builder()
                .code(200)
                .message("Successfully retrieved activities")
                .result(activityService.getAllActivities())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ActivityResponse> updateActivity(@PathVariable Long id, @Valid @RequestBody UpdateActivity request) {
        return ApiResponse.<ActivityResponse>builder()
                .code(200)
                .message("Successfully updated activity")
                .result(activityService.updateActivity(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Activity deleted successfully")
                .build();
    }
}
