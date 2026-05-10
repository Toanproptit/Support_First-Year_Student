package org.example.supportfirststudents.controller;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateTerm;
import org.example.supportfirststudents.dto.request.UpdateTerm;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.TermResponse;
import org.example.supportfirststudents.service.TermService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/terms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TermController {
    TermService termService;

    @PreAuthorize("hasAnyRole('Admin')")
    @PostMapping
    public ApiResponse<TermResponse> create(@Valid @RequestBody CreateTerm request) {
        return ApiResponse.<TermResponse>builder()
                .result(termService.create(request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @GetMapping("/{code}")
    public ApiResponse<TermResponse> getByCode(@PathVariable String code) {
        return ApiResponse.<TermResponse>builder()
                .result(termService.getByCode(code))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin','Student')")
    @GetMapping
    public ApiResponse<List<TermResponse>> getAll() {
        return ApiResponse.<List<TermResponse>>builder()
                .result(termService.getAll())
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @PutMapping("/{code}")
    public ApiResponse<TermResponse> update(@PathVariable String code, @Valid @RequestBody UpdateTerm request) {
        return ApiResponse.<TermResponse>builder()
                .result(termService.update(code, request))
                .build();
    }

    @PreAuthorize("hasAnyRole('Admin')")
    @DeleteMapping("/{code}")
    public ApiResponse<Void> delete(@PathVariable String code) {
        termService.delete(code);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Term deleted successfully")
                .build();
    }
}
