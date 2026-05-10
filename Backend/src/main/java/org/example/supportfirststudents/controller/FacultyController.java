package org.example.supportfirststudents.controller;

import java.util.List;

import org.example.supportfirststudents.dto.request.CreateFaculty;
import org.example.supportfirststudents.dto.request.UpdateFaculty;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.FacultyResponse;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.service.FacultyService;
import org.example.supportfirststudents.service.MajorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/faculties")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAnyRole('Admin')")
public class FacultyController {
    FacultyService facultyService;
    MajorService majorService;

    @PostMapping
    public ApiResponse<FacultyResponse> createFaculty(@Valid @RequestBody CreateFaculty request) {
        return ApiResponse.<FacultyResponse>builder()
                .result(facultyService.createFaculty(request))
                .build();
    }

    @GetMapping("/{code}")
    public ApiResponse<FacultyResponse> getFacultyByCode(@PathVariable String code) {
        return ApiResponse.<FacultyResponse>builder()
                .result(facultyService.getFacultyByCode(code))
                .build();
    }

    @GetMapping
    public ApiResponse<List<FacultyResponse>> getAllFaculties() {
        return ApiResponse.<List<FacultyResponse>>builder()
                .result(facultyService.getAllFaculties())
                .build();
    }

    @PutMapping("/{code}")
    public ApiResponse<FacultyResponse> updateFaculty(@PathVariable String code, @Valid @RequestBody UpdateFaculty request) {
        return ApiResponse.<FacultyResponse>builder()
                .code(200)
                .message("updated Success")
                .result(facultyService.updateFaculty(code, request))
                .build();
    }

    @GetMapping("/{code}/majors")
    public ApiResponse<List<MajorResponse>> getMajorsByFaculty(@PathVariable String code) {
        return ApiResponse.<List<MajorResponse>>builder()
                .result(majorService.getMajorsByFacultyCode(code))
                .build();
    }

    @DeleteMapping("/{code}")
    public ApiResponse<FacultyResponse> deleteFacultyByCode(@PathVariable String code) {
        facultyService.delete(code);
        return ApiResponse.<FacultyResponse>builder()
                .code(200)
                .message("deleted Success")
                .build();
    }
}
