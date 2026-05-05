package org.example.supportfirststudents.mapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateActivity;
import org.example.supportfirststudents.dto.request.UpdateActivity;
import org.example.supportfirststudents.dto.response.ActivityResponse;
import org.example.supportfirststudents.entity.Activity;
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
        return activity;
    }

    public void updateActivity(Activity activity, UpdateActivity request) {
        activity.setName(request.getName());
        activity.setStartDate(request.getStartDate());
        activity.setEndDate(request.getEndDate());
        activity.setAddress(request.getAddress());
        activity.setStatus(request.getStatus());
        activity.setDescription(request.getDescription());
    }

    public ActivityResponse toActivityResponse(Activity activity) {
        List<?> participations = activity.getParticipations();

        return ActivityResponse.builder()
                .id(activity.getId())
                .name(activity.getName())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .address(activity.getAddress())
                .status(activity.getStatus())
                .description(activity.getDescription())
                .participantCount(participations != null ? participations.size() : 0)
                .participations(activity.getParticipations() != null
                        ? activity.getParticipations().stream().map(participationMapper::toParticipationResponse).toList()
                        : List.of())
                .build();
    }
}
