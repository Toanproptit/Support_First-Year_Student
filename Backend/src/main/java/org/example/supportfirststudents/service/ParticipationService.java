package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateParticipation;
import org.example.supportfirststudents.dto.response.ParticipationResponse;
import org.example.supportfirststudents.entity.Activity;
import org.example.supportfirststudents.entity.Participation;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.ParticipationMapper;
import org.example.supportfirststudents.repository.ActivityRepository;
import org.example.supportfirststudents.repository.ParticipationRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParticipationService {

    ParticipationRepository participationRepository;
    UserRepository userRepository;
    ActivityRepository activityRepository;
    ParticipationMapper participationMapper;

    @Transactional
    public ParticipationResponse createParticipation(CreateParticipation request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Appexception(ErrorCode.USER_NOT_FOUND));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new Appexception(ErrorCode.ACTIVITY_NOT_FOUND));

        if (participationRepository.existsByUserIdAndActivityId(user.getId(), activity.getId())) {
            throw new Appexception(ErrorCode.PARTICIPATION_ALREADY_EXISTS);
        }

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setActivity(activity);
        participation.setRole(request.getRole() != null ? request.getRole() : "PARTICIPANT");

        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    public List<ParticipationResponse> getParticipationsByUserId(Long userId) {
        validateUserExists(userId);

        return participationRepository.findByUserId(userId).stream()
                .map(participationMapper::toParticipationResponse)
                .toList();
    }

    public List<ParticipationResponse> getParticipationsByActivityId(Long activityId) {
        validateActivityExists(activityId);

        return participationRepository.findByActivityId(activityId).stream()
                .map(participationMapper::toParticipationResponse)
                .toList();
    }

    @Transactional
    public void deleteParticipation(Long userId, Long activityId) {
        Participation participation = participationRepository.findByUserIdAndActivityId(userId, activityId)
                .orElseThrow(() -> new Appexception(ErrorCode.PARTICIPATION_NOT_FOUND));
        participationRepository.delete(participation);
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new Appexception(ErrorCode.USER_NOT_FOUND);
        }
    }

    private void validateActivityExists(Long activityId) {
        if (!activityRepository.existsById(activityId)) {
            throw new Appexception(ErrorCode.ACTIVITY_NOT_FOUND);
        }
    }
}
