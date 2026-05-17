package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.ReviewCancelParticipationRequest;
import org.example.supportfirststudents.dto.request.CreateParticipation;
import org.example.supportfirststudents.dto.response.ParticipationResponse;
import org.example.supportfirststudents.entity.Activity;
import org.example.supportfirststudents.entity.Participation;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.enums.ParticipationStatus;
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

import java.time.LocalDateTime;
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

        Participation existing = participationRepository.findByUserIdAndActivityId(user.getId(), activity.getId())
                .orElse(null);
        if (existing != null) {
            ParticipationStatus status = normalizeStatus(existing.getStatus());
            if (status == ParticipationStatus.CANCELLED) {
                validateCapacity(activity);
                existing.setStatus(ParticipationStatus.ACTIVE);
                existing.setRole(request.getRole() != null ? request.getRole() : "PARTICIPANT");
                existing.setJoinDate(LocalDateTime.now());
                clearCancelFields(existing);
                return participationMapper.toParticipationResponse(participationRepository.save(existing));
            }
            if (status == ParticipationStatus.CANCEL_REQUESTED) {
                throw new AppException(ErrorCode.PARTICIPATION_CANCEL_REQUESTED);
            }
            throw new AppException(ErrorCode.PARTICIPATION_ALREADY_EXISTS);
        }

        validateCapacity(activity);

        Participation participation = new Participation();
        participation.setUser(user);
        participation.setActivity(activity);
        participation.setRole(request.getRole() != null ? request.getRole() : "PARTICIPANT");
        participation.setStatus(ParticipationStatus.ACTIVE);

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
                .filter(p -> normalizeStatus(p.getStatus()) != ParticipationStatus.CANCELLED)
                .map(participationMapper::toParticipationResponse)
                .toList();
    }

    @Transactional
    public void deleteParticipation(Long userId, Long activityId) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findByUserIdAndActivityId(userId, activityId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));
        participationRepository.delete(participation);
    }

    @Transactional
    public ParticipationResponse requestCancelParticipation(Long participationId, String reason) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));

        Long ownerId = participation.getUser() != null ? participation.getUser().getId() : null;
        if (!isAdminCaller() && (ownerId == null || !isCallerUserId(ownerId))) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        ParticipationStatus status = normalizeStatus(participation.getStatus());
        if (status == ParticipationStatus.CANCEL_REQUESTED) {
            throw new AppException(ErrorCode.PARTICIPATION_CANCEL_REQUESTED);
        }
        if (status == ParticipationStatus.CANCELLED) {
            throw new AppException(ErrorCode.PARTICIPATION_ALREADY_EXISTS);
        }

        participation.setStatus(ParticipationStatus.CANCEL_REQUESTED);
        participation.setCancelRequestReason(reason);
        participation.setCancelRequestedAt(LocalDateTime.now());
        participation.setCancelRequestedBy(ownerId);
        participation.setCancelReviewedAt(null);
        participation.setCancelReviewedBy(null);
        participation.setCancelReviewNote(null);

        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    @Transactional
    public ParticipationResponse approveCancelParticipation(Long participationId, ReviewCancelParticipationRequest request) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));

        ParticipationStatus status = normalizeStatus(participation.getStatus());
        if (status != ParticipationStatus.CANCEL_REQUESTED) {
            throw new AppException(ErrorCode.PARTICIPATION_CANCEL_NOT_REQUESTED);
        }

        participation.setStatus(ParticipationStatus.CANCELLED);
        participation.setCancelReviewedAt(LocalDateTime.now());
        participation.setCancelReviewedBy(getCallerUserId());
        participation.setCancelReviewNote(request != null ? request.getNote() : null);
        return participationMapper.toParticipationResponse(participationRepository.save(participation));
    }

    @Transactional
    public ParticipationResponse rejectCancelParticipation(Long participationId, ReviewCancelParticipationRequest request) {
        if (!isAdminCaller()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new AppException(ErrorCode.PARTICIPATION_NOT_FOUND));

        ParticipationStatus status = normalizeStatus(participation.getStatus());
        if (status != ParticipationStatus.CANCEL_REQUESTED) {
            throw new AppException(ErrorCode.PARTICIPATION_CANCEL_NOT_REQUESTED);
        }

        participation.setStatus(ParticipationStatus.ACTIVE);
        participation.setCancelReviewedAt(LocalDateTime.now());
        participation.setCancelReviewedBy(getCallerUserId());
        participation.setCancelReviewNote(request != null ? request.getNote() : null);
        return participationMapper.toParticipationResponse(participationRepository.save(participation));
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

    private Long getCallerUserId() {
        User caller = getCallerUser();
        return caller != null ? caller.getId() : null;
    }

    private void validateCapacity(Activity activity) {
        Integer limit = activity.getStudentQuantity();
        if (limit == null || limit <= 0) {
            return;
        }
        long current = participationRepository.countNotCancelledByActivityId(activity.getId(), ParticipationStatus.CANCELLED);
        if (current >= limit) {
            throw new AppException(ErrorCode.ACTIVITY_CAPACITY_FULL);
        }
    }

    private ParticipationStatus normalizeStatus(ParticipationStatus status) {
        return status != null ? status : ParticipationStatus.ACTIVE;
    }

    private void clearCancelFields(Participation p) {
        p.setCancelRequestReason(null);
        p.setCancelRequestedAt(null);
        p.setCancelRequestedBy(null);
        p.setCancelReviewedAt(null);
        p.setCancelReviewedBy(null);
        p.setCancelReviewNote(null);
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
