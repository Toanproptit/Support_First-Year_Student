package org.example.supportfirststudents.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateMajor;
import org.example.supportfirststudents.dto.request.UpdateMajor;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.service.MajorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/majors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAnyRole('Admin')")
public class MajorController {
    MajorService majorService;

    @PostMapping
    public ApiResponse<MajorResponse> createMajor(@Valid @RequestBody CreateMajor request) {
        return ApiResponse.<MajorResponse>builder()
                .code(200)
                .message("created Success")
                .result(majorService.createMajor(request))
                .build();
    }

    @GetMapping("/{code}")
    public ApiResponse<MajorResponse> getMajorByCode(@PathVariable String code) {
        return ApiResponse.<MajorResponse>builder()
                .result(majorService.getMajorByCode(code))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MajorResponse>> getAllMajors(@RequestParam(required = false) String facultyCode) {
        return ApiResponse.<List<MajorResponse>>builder()
                .result(facultyCode == null ? majorService.getAllMajors() : majorService.getMajorsByFacultyCode(facultyCode))
                .build();
    }

    @PutMapping("/{code}")
    public ApiResponse<MajorResponse> updateMajor(@PathVariable String code, @Valid @RequestBody UpdateMajor request) {
        return ApiResponse.<MajorResponse>builder()
                .code(200)
                .message("updated Success")
                .result(majorService.updateMajor(code, request))
                .build();
    }

    @DeleteMapping("/{code}")
    public ApiResponse<Void> deleteMajor(@PathVariable String code) {
        majorService.deleteMajor(code);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("deleted Success")
                .build();
    }
}
