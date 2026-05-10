package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.RegisterCourseSection;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.service.StudentCourseSectionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/course-section-registrations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentCourseSectionController {
    StudentCourseSectionService studentCourseSectionService;

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @PostMapping
    public ApiResponse<Void> register(@Valid @RequestBody RegisterCourseSection request) {
        studentCourseSectionService.register(request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Registered successfully")
                .build();
    }

    @PreAuthorize("hasAnyRole('Student')")
    @DeleteMapping("/{courseSectionCode}")
    public ApiResponse<Void> unregister(@PathVariable String courseSectionCode) {
        studentCourseSectionService.unregister(courseSectionCode);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Unregistered successfully")
                .build();
    }

    @PreAuthorize("hasAnyRole('Student')")
    @GetMapping("/me")
    public ApiResponse<List<CourseSectionResponse>> myCourseSections() {
        return ApiResponse.<List<CourseSectionResponse>>builder()
                .result(studentCourseSectionService.myCourseSections())
                .build();
    }
}
