package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateActivity;
import org.example.supportfirststudents.dto.request.UpdateActivity;
import org.example.supportfirststudents.dto.response.ActivityResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.entity.Activity;
import org.example.supportfirststudents.enums.ActivityStatus;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.ActivityMapper;
import org.example.supportfirststudents.repository.ActivityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    public PageResponse<ActivityResponse> getAllActivitiesPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.DESC, "startDate"));
        Page<Activity> activityPage = activityRepository.findAll(pageable);

        List<ActivityResponse> content = activityPage.getContent()
                .stream()
                .map(activityMapper::toActivityResponse)
                .toList();

        return PageResponse.<ActivityResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(activityPage.getTotalElements())
                .totalPages(activityPage.getTotalPages())
                .first(activityPage.isFirst())
                .last(activityPage.isLast())
                .build();
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

    private PageRequest buildPageRequest(int page, int size, Sort sort) {
        int validatePage = Math.max(page, 0);
        int validateSize = size <= 0 ? 10 : Math.min(size, 100);
        return PageRequest.of(validatePage, validateSize, sort);
    }
}
