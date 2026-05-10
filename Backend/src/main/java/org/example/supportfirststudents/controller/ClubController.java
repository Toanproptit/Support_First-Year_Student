package org.example.supportfirststudents.controller;


import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateClub;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.dto.response.ClubResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.repository.ClubRepository;
import org.example.supportfirststudents.service.ClubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/clubs")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClubController {

    final ClubService clubService;

    @GetMapping()
    public ApiResponse<List<ClubResponse>> getAllClubs() {
        return ApiResponse.<List<ClubResponse>>builder()
                .code(200)
                .message("Success")
                .result(clubService.getAllClubs())
                .build();
    }

    @GetMapping("/page")
    public ApiResponse<PageResponse<ClubResponse>> getAllClubsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ClubResponse>>builder()
                .code(200)
                .message("Success")
                .result(clubService.getAllClubsPaged(page, size))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ClubResponse> getClubById(@PathVariable Long id) {
        return ApiResponse.<ClubResponse>builder()
                .code(200)
                .message("Success")
                .result(clubService.getClubById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<ClubResponse> createClub(@RequestBody CreateClub  createClub) {
        return ApiResponse.<ClubResponse>builder()
                .code(200)
                .message("success")
                .result(clubService.createClub(createClub))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ClubResponse> updateClub(@PathVariable Long id, @RequestBody CreateClub createClub) {
        return ApiResponse.<ClubResponse>builder()
                .code(200)
                .message("success")
                .result(clubService.updateClub(id,createClub))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<ClubResponse> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ApiResponse.<ClubResponse>builder()
                .code(200)
                .message("success")
                .build();
    }
}
