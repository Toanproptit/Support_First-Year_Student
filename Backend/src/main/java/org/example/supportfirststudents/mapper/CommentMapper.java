package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateComment;
import org.example.supportfirststudents.dto.request.UpdateComment;
import org.example.supportfirststudents.dto.response.CommentResponse;
import org.example.supportfirststudents.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public Comment toComment(CreateComment request) {
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        return comment;
    }

    public CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .postId(comment.getPost() != null ? comment.getPost().getId() : null)
                .postTitle(comment.getPost() != null ? comment.getPost().getTitle() : null)
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .userName(comment.getUser() != null ? comment.getUser().getUserName() : null)
                .build();
    }

    public void updateComment(Comment comment, UpdateComment request) {
        comment.setContent(request.getContent());
    }
}

