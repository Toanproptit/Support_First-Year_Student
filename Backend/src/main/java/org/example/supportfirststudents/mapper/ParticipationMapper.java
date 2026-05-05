package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.ParticipationResponse;
import org.example.supportfirststudents.entity.Participation;
import org.springframework.stereotype.Component;

@Component
public class ParticipationMapper {

    public ParticipationResponse toParticipationResponse(Participation participation) {
        return ParticipationResponse.builder()
                .id(participation.getId())
                .userId(participation.getUser() != null ? participation.getUser().getId() : null)
                .userName(participation.getUser() != null ? participation.getUser().getUserName() : null)
                .activityId(participation.getActivity() != null ? participation.getActivity().getId() : null)
                .joinDate(participation.getJoinDate())
                .role(participation.getRole())
                .build();
    }
}
