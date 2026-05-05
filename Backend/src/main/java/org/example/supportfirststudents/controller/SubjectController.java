package org.example.supportfirststudents.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.SubjectResponse;
import org.example.supportfirststudents.service.SubjectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectController {
    SubjectService subjectService;

    @GetMapping("/{code}")
    public ApiResponse<SubjectResponse> getSubjectByCode(@PathVariable String code) {
        return ApiResponse.<SubjectResponse>builder()
                .result(subjectService.getSubjectByCode(code))
                .build();
    }

    @GetMapping
    public ApiResponse<List<SubjectResponse>> getAllSubjects() {
        return ApiResponse.<List<SubjectResponse>>builder()
                .result(subjectService.getAllSubjects())
                .build();
    }
}
