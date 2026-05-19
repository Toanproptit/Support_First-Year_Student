package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateCourseSectionReview;
import org.example.supportfirststudents.dto.request.UpdateCourseSectionReview;
import org.example.supportfirststudents.dto.response.CourseSectionReviewResponse;
import org.example.supportfirststudents.entity.CourseSection;
import org.example.supportfirststudents.entity.CourseSectionReview;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CourseSectionReviewMapper;
import org.example.supportfirststudents.repository.CourseSectionRepository;
import org.example.supportfirststudents.repository.CourseSectionReviewRepository;
import org.example.supportfirststudents.repository.StudentCourseSectionRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionReviewService {
    CourseSectionReviewRepository reviewRepository;
    CourseSectionRepository courseSectionRepository;
    StudentCourseSectionRepository studentCourseSectionRepository;
    UserRepository userRepository;
    CourseSectionReviewMapper reviewMapper;

    @Transactional
    public CourseSectionReviewResponse create(CreateCourseSectionReview request) {
        User user = resolveUserForCreate(request.getUserId());
        CourseSection courseSection = courseSectionRepository.findById(normalizeCode(request.getCourseSectionCode()))
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND));

        if (reviewRepository.existsByUser_IdAndCourseSection_CodeAndDeletedAtIsNull(user.getId(), courseSection.getCode())) {
            throw new AppException(ErrorCode.COURSE_SECTION_REVIEW_ALREADY_EXISTS);
        }

        if (!isAdminCaller()) {
            enforceCourseSectionInProgress(courseSection);
            if (!studentCourseSectionRepository.existsByUser_IdAndCourseSection_Code(user.getId(), courseSection.getCode())) {
                throw new AppException(ErrorCode.COURSE_SECTION_REVIEW_REQUIRES_ENROLLMENT);
            }
        }

        CourseSectionReview review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setCourseSection(courseSection);

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    public CourseSectionReviewResponse getById(Long id) {
        return reviewMapper.toResponse(findById(id));
    }

    public List<CourseSectionReviewResponse> getMyReviews() {
        User caller = getCallerUser();
        if (caller == null || caller.getId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return reviewRepository.findByUser_IdAndDeletedAtIsNull(caller.getId()).stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    public List<CourseSectionReviewResponse> getByCourseSection(String courseSectionCode) {
        return reviewRepository.findByCourseSection_CodeAndDeletedAtIsNull(normalizeCode(courseSectionCode)).stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    @Transactional
    public CourseSectionReviewResponse update(Long id, UpdateCourseSectionReview request) {
        CourseSectionReview review = findById(id);
        if (!isAdminCaller() && !isCallerUserId(review.getUser().getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        reviewMapper.updateEntity(review, request);
        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long id) {
        CourseSectionReview review = findById(id);
        if (!isAdminCaller() && !isCallerUserId(review.getUser().getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (isAdminCaller()) {
            reviewRepository.delete(review);
            return;
        }
        review.setDeletedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    private CourseSectionReview findById(Long id) {
        return reviewRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_REVIEW_NOT_FOUND));
    }

    private User resolveUserForCreate(Long userIdFromRequest) {
        if (isAdminCaller()) {
            if (userIdFromRequest == null) {
                throw new AppException(ErrorCode.USER_ID_REQUIRED);
            }
            return userRepository.findById(userIdFromRequest)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
        User caller = getCallerUser();
        if (caller == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return caller;
    }

    private void enforceCourseSectionInProgress(CourseSection courseSection) {
        if (courseSection == null) throw new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND);
        LocalDate start = courseSection.getStartDate();
        LocalDate end = courseSection.getEndDate();
        if (start == null || end == null) {
            throw new AppException(ErrorCode.COURSE_SECTION_REVIEW_NOT_IN_PROGRESS);
        }
        LocalDate today = LocalDate.now();
        if (today.isBefore(start) || today.isAfter(end)) {
            throw new AppException(ErrorCode.COURSE_SECTION_REVIEW_NOT_IN_PROGRESS);
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
            String value = authority.getAuthority();
            if ("ROLE_Admin".equals(value) || "ROLE_ADMIN".equals(value)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
