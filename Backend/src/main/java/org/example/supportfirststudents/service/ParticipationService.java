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
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.ParticipationMapper;
import org.example.supportfirststudents.repository.ActivityRepository;
import org.example.supportfirststudents.repository.ParticipationRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
        if (!isAdminCaller() && !isCallerUserId(request.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        if (participationRepository.existsByUserIdAndActivityId(user.getId(), activity.getId())) {
            throw new AppException(ErrorCode.PARTICIPATION_ALREADY_EXISTS);
        }

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setActivity(activity);
        participation.setRole(request.getRole() != null ? request.getRole() : "PARTICIPANT");

        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    public List<ParticipationResponse> getParticipationsByUserId(Long userId) {
        validateUserExists(userId);
        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

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
        if (!isAdminCaller() && !isCallerUserId(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findByUserIdAndActivityId(userId, activityId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));
        participationRepository.delete(participation);
    }

    @Transactional
    public ParticipationResponse setParticipationLead(Long participationId) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));
        participation.setRole("LEAD");
        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    @Transactional
    public ParticipationResponse unsetParticipationLead(Long participationId) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));
        participation.setRole("PARTICIPANT");
        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    private void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    private void validateActivityExists(Long activityId) {
        if (!activityRepository.existsById(activityId)) {
            throw new AppException(ErrorCode.ACTIVITY_NOT_FOUND);
        }
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
