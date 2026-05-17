package org.example.supportfirststudents.mapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateActivity;
import org.example.supportfirststudents.dto.request.UpdateActivity;
import org.example.supportfirststudents.dto.response.ActivityResponse;
import org.example.supportfirststudents.entity.Activity;
import org.example.supportfirststudents.entity.Participation;
import org.example.supportfirststudents.enums.ParticipationStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActivityMapper {

    ParticipationMapper participationMapper;

    public Activity toActivity(CreateActivity request) {
        Activity activity = new Activity();
        activity.setName(request.getName());
        activity.setStartDate(request.getStartDate());
        activity.setEndDate(request.getEndDate());
        activity.setAddress(request.getAddress());
        activity.setStatus(request.getStatus());
        activity.setDescription(request.getDescription());
        Integer q = request.getStudentQuantity();
        activity.setStudentQuantity(q != null && q > 0 ? q : null);
        return activity;
    }

    public void updateActivity(Activity activity, UpdateActivity request) {
        activity.setName(request.getName());
        activity.setStartDate(request.getStartDate());
        activity.setEndDate(request.getEndDate());
        activity.setAddress(request.getAddress());
        activity.setStatus(request.getStatus());
        activity.setDescription(request.getDescription());
        if (request.getStudentQuantity() != null) {
            Integer q = request.getStudentQuantity();
            activity.setStudentQuantity(q != null && q > 0 ? q : null);
        }
    }

    public ActivityResponse toActivityResponse(Activity activity) {
        List<Participation> participations = activity.getParticipations() != null ? activity.getParticipations() : List.of();
        List<Participation> activeParticipations = participations.stream()
                .filter(p -> p.getStatus() == null || p.getStatus() != ParticipationStatus.CANCELLED)
                .toList();

        return ActivityResponse.builder()
                .id(activity.getId())
                .name(activity.getName())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .address(activity.getAddress())
                .status(activity.getStatus())
                .description(activity.getDescription())
                .studentQuantity(activity.getStudentQuantity())
                .participantCount(activeParticipations.size())
                .participations(activeParticipations != null
                        ? activeParticipations.stream().map(participationMapper::toParticipationResponse).toList()
                        : List.of())
                .build();
    }
}
