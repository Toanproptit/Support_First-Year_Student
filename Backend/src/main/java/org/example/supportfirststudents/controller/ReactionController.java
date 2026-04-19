package org.example.supportfirststudents.controller;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.CreateReaction;
import org.example.supportfirststudents.dto.response.ApiResponse;
import org.example.supportfirststudents.entity.Reaction;
import org.example.supportfirststudents.repository.ReactionRepository;
import org.example.supportfirststudents.service.ReactionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reactions")
@RequiredArgsConstructor
public class ReactionController {
    private final ReactionRepository reactionRepository;
    private final ReactionService reactionService;

    @PostMapping
    public ApiResponse<Reaction> createReaction(@RequestBody CreateReaction request){
        reactionService.createReaction(request);
        return ApiResponse.<Reaction>builder()
                .code(200)
                .message("Reaction created")
                .build();
    }

    @DeleteMapping
    public ApiResponse<Reaction> deleteReaction(@RequestParam Long userId , @RequestParam Long postId){
        reactionService.removeReaction(userId,postId);
        return ApiResponse.<Reaction>builder()
                .code(200)
                .message("Reaction deleted")
                .build();
    }
}
