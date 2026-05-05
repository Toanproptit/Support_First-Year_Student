package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateParticipation;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.ParticipationResponse;
import org.example.supportfirststudents.service.ParticipationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParticipationController {

    ParticipationService participationService;

    @PostMapping
    public ApiResponse<ParticipationResponse> createParticipation(@Valid @RequestBody CreateParticipation request) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Participation Created")
                .result(participationService.createParticipation(request))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ParticipationResponse>> getParticipationsByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<ParticipationResponse>>builder()
                .code(200)
                .message("Participation List")
                .result(participationService.getParticipationsByUserId(userId))
                .build();
    }

    @GetMapping("/activity/{activityId}")
    public ApiResponse<List<ParticipationResponse>> getParticipationsByActivityId(@PathVariable Long activityId) {
        return ApiResponse.<List<ParticipationResponse>>builder()
                .code(200)
                .message("Participation List")
                .result(participationService.getParticipationsByActivityId(activityId))
                .build();
    }

    @DeleteMapping
    public ApiResponse<Void> deleteParticipation(@RequestParam Long userId, @RequestParam Long activityId) {
        participationService.deleteParticipation(userId, activityId);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Participation Deleted")
                .message("Participation deleted successfully")
                .build();
    }
}
