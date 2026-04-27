package org.example.supportfirststudents.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.service.MajorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/majors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MajorController {
    MajorService majorService;

    @GetMapping("/{code}")
    public ApiResponse<MajorResponse> getMajorByCode(@PathVariable String code) {
        return ApiResponse.<MajorResponse>builder()
                .result(majorService.getMajorByCode(code))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MajorResponse>> getAllMajors() {
        return ApiResponse.<List<MajorResponse>>builder()
                .result(majorService.getAllMajors())
                .build();
    }
}
