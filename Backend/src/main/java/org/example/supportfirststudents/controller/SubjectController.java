package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateSubject;
import org.example.supportfirststudents.dto.request.UpdateSubject;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.dto.response.SubjectResponse;
import org.example.supportfirststudents.service.SubjectService;
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
@RequestMapping("/subjects")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectController {
    SubjectService subjectService;

    @GetMapping("/{code}")
    @PreAuthorize("hasAnyRole('Admin','Student')")
    public ApiResponse<SubjectResponse> getSubjectByCode(@PathVariable String code) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectService.getSubjectByCode(code))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('Admin','Student')")
    public ApiResponse<List<SubjectResponse>> getAllSubjects() {
        return ApiResponse.<List<SubjectResponse>>builder()
                .result(subjectService.getAllSubjects())
                .build();
    }

    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('Admin','Student')")
    public ApiResponse<PageResponse<SubjectResponse>> getAllSubjectsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<SubjectResponse>>builder()
                .result(subjectService.getAllSubjectsPaged(page, size))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('Admin')")
    public ApiResponse<SubjectResponse> create(@Valid @RequestBody CreateSubject request) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectService.create(request))
                .build();
    }

    @PutMapping("/{code}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ApiResponse<SubjectResponse> update(@PathVariable String code, @Valid @RequestBody UpdateSubject request) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectService.update(code, request))
                .build();
    }

    @DeleteMapping("/{code}")
    @PreAuthorize("hasAnyRole('Admin')")
    public ApiResponse<Void> delete(@PathVariable String code) {
        subjectService.delete(code);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Subject deleted successfully")
                .build();
    }
}
