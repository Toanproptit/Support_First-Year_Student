package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateActivity;
import org.example.supportfirststudents.dto.request.UpdateActivity;
import org.example.supportfirststudents.dto.response.ActivityResponse;
import org.example.supportfirststudents.entity.Activity;
import org.example.supportfirststudents.enums.ActivityStatus;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.ActivityMapper;
import org.example.supportfirststudents.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActivityService {

    ActivityRepository activityRepository;
    ActivityMapper activityMapper;

    @Transactional
    public ActivityResponse createActivity(CreateActivity request) {
        Activity activity = activityMapper.toActivity(request);
        validateDateRange(activity);
        if (activity.getStatus() == null) {
            activity.setStatus(ActivityStatus.UPCOMING);
        }
        return activityMapper.toActivityResponse(activityRepository.save(activity));
    }

    public ActivityResponse getActivityById(Long id) {
        Activity activity = activityRepository.findByIdWithParticipations(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        return activityMapper.toActivityResponse(activity);
    }

    public List<ActivityResponse> getAllActivities() {
        return activityRepository.findAllWithParticipations().stream()
                .map(activityMapper::toActivityResponse)
                .toList();
    }

    @Transactional
    public ActivityResponse updateActivity(Long id, UpdateActivity request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        activityMapper.updateActivity(activity, request);
        validateDateRange(activity);
        return activityMapper.toActivityResponse(activityRepository.save(activity));
    }

    @Transactional
    public void deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        activityRepository.delete(activity);
    }

    private void validateDateRange(Activity activity) {
        if (activity.getStartDate() == null || activity.getEndDate() == null) {
            return;
        }
        if (!activity.getStartDate().before(activity.getEndDate())) {
            throw new AppException(ErrorCode.ACTIVITY_DATE_INVALID);
        }
    }
}
