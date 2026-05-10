package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateCourseSection;
import org.example.supportfirststudents.dto.request.UpdateCourseSection;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.service.CourseSectionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/course-sections")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionController {
    CourseSectionService courseSectionService;

    @PreAuthorize("hasAnyRole('Admin')")
    @PostMapping
    public ApiResponse<CourseSectionResponse> create(@Valid @RequestBody CreateCourseSection request) {
        return ApiResponse.<CourseSectionResponse>builder()
                .result(courseSectionService.create(request))
                .build();
    }

    @GetMapping("/{code}")
    @PreAuthorize("hasAnyRole('Admin','Student')")
    public ApiResponse<CourseSectionResponse> getCourseSectionByCode(@PathVariable String code) {
        return ApiResponse.<CourseSectionResponse>builder()
                .result(courseSectionService.getCourseSectionByCode(code))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin','Student')")
    public ApiResponse<List<CourseSectionResponse>> getAllCourseSections(
            @RequestParam(required = false) String termCode,
            @RequestParam(required = false) String majorCode,
            @RequestParam(required = false) String subjectCode
    ) {
        return ApiResponse.<List<CourseSectionResponse>>builder()
                .result(courseSectionService.getAllCourseSections(termCode, majorCode, subjectCode))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @PutMapping("/{code}")
    public ApiResponse<CourseSectionResponse> update(@PathVariable String code,
                                                     @Valid @RequestBody UpdateCourseSection request) {
        return ApiResponse.<CourseSectionResponse>builder()
                .result(courseSectionService.update(code, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @DeleteMapping("/{code}")
    public ApiResponse<Void> delete(@PathVariable String code) {
        courseSectionService.delete(code);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Course section deleted successfully")
                .build();
    }
}
