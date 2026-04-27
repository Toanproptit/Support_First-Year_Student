package org.example.supportfirststudents.controller;

import java.util.List;

import org.example.supportfirststudents.dto.request.CreateFaculty;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.FacultyResponse;
import org.example.supportfirststudents.service.FacultyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/faculties")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacultyController {
    FacultyService facultyService;

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
}
