package org.example.supportfirststudents.service;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.request.CreateReaction;
import org.example.supportfirststudents.entity.Post;
import org.example.supportfirststudents.entity.Reaction;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.repository.PostRepository;
import org.example.supportfirststudents.repository.ReactionRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReactionService {
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public void createReaction(CreateReaction request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(() ->
                new RuntimeException(ErrorCode.USER_NOT_FOUND.getMessage()));
        Post post = postRepository.findById(request.getPostId()).orElseThrow(() ->
                new RuntimeException(ErrorCode.POST_NOT_FOUND.getMessage()));
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
        Reaction reation = reactionRepository.findByUserIdAndPostId(userId,postId).orElseThrow(()->
                new RuntimeException(ErrorCode.REACTION_NOT_FOUND.getMessage()));
        reactionRepository.delete(reation);
    }
}
