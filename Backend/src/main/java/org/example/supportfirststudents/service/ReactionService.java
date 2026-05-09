package org.example.supportfirststudents.service;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.CreateReaction;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.Reaction;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.ReactionRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public void createReaction(CreateReaction request) {
        if (!isAdminCaller() && !isCallerUserId(request.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        User user = userRepository.findById(request.getUserId()).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.findById(request.getPostId()).orElseThrow(() ->
                new AppException(ErrorCode.POST_NOT_FOUND));
        Optional<Reaction> existingReaction = reactionRepository.findByUserIdAndPostId(user.getId(), post.getId());

        if(existingReaction.isPresent()) {
            Reaction reaction = existingReaction.get();
            reaction.setType(request.getReactionType());
            reactionRepository.save(reaction);
        }
        else{
            Reaction reaction = new Reaction();
            reaction.setUser(user);
            reaction.setPost(post);
            reaction.setType(request.getReactionType());
            reactionRepository.save(reaction);
        }
    }

    public void removeReaction(long userId, long postId) {
        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Reaction reaction = reactionRepository.findByUserIdAndPostId(userId, postId).orElseThrow(() ->
                new AppException(ErrorCode.REACTION_NOT_FOUND));
        reactionRepository.delete(reaction);
    }

    private boolean isCallerUserId(Long userId) {
        User caller = getCallerUser();
        return caller != null && caller.getId() != null && caller.getId().equals(userId);
    }

    private User getCallerUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }

    private boolean isAdminCaller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if ("ROLE_Admin".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
