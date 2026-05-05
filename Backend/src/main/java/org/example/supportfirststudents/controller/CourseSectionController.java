package org.example.supportfirststudents.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.service.CourseSectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/course-sections")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionController {
    CourseSectionService courseSectionService;

    @GetMapping("/{code}")
    public ApiResponse<CourseSectionResponse> getCourseSectionByCode(@PathVariable String code) {
        return ApiResponse.<CourseSectionResponse>builder()
                .result(courseSectionService.getCourseSectionByCode(code))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CourseSectionResponse>> getAllCourseSections() {
        return ApiResponse.<List<CourseSectionResponse>>builder()
                .result(courseSectionService.getAllCourseSections())
                .build();
    }
}
