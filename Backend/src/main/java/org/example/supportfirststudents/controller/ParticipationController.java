package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CancelParticipationRequest;
import org.example.supportfirststudents.dto.request.CreateParticipation;
import org.example.supportfirststudents.dto.request.ReviewCancelParticipationRequest;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.ParticipationResponse;
import org.example.supportfirststudents.service.ParticipationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('Admin','Student')")
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

    @PostMapping("/{id}/cancel-request")
    public ApiResponse<ParticipationResponse> requestCancel(@PathVariable Long id, @RequestBody CancelParticipationRequest request) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Cancel request submitted")
                .result(participationService.requestCancelParticipation(id, request != null ? request.getReason() : null))
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}/cancel-approve")
    public ApiResponse<ParticipationResponse> approveCancel(@PathVariable Long id, @RequestBody(required = false) ReviewCancelParticipationRequest request) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Cancel approved")
                .result(participationService.approveCancelParticipation(id, request))
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}/cancel-reject")
    public ApiResponse<ParticipationResponse> rejectCancel(@PathVariable Long id, @RequestBody(required = false) ReviewCancelParticipationRequest request) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Cancel rejected")
                .result(participationService.rejectCancelParticipation(id, request))
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @PutMapping("/{id}/lead")
    public ApiResponse<ParticipationResponse> setParticipationLead(@PathVariable Long id) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Participation updated")
                .result(participationService.setParticipationLead(id))
                .build();
    }

    @PreAuthorize("hasRole('Admin')")
    @DeleteMapping("/{id}/lead")
    public ApiResponse<ParticipationResponse> unsetParticipationLead(@PathVariable Long id) {
        return ApiResponse.<ParticipationResponse>builder()
                .code(200)
                .message("Participation updated")
                .result(participationService.unsetParticipationLead(id))
                .build();
    }

    @DeleteMapping
    @PreAuthorize("hasRole('Admin')")
    public ApiResponse<Void> deleteParticipation(@RequestParam Long userId, @RequestParam Long activityId) {
        participationService.deleteParticipation(userId, activityId);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Participation deleted successfully")
                .build();
    }
}
