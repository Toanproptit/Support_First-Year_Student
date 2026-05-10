package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.RegisterCourseSection;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.entity.CourseSection;
import org.example.supportfirststudents.entity.StudentCourseSection;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CourseSectionMapper;
import org.example.supportfirststudents.repository.CourseSectionRepository;
import org.example.supportfirststudents.repository.StudentCourseSectionRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentCourseSectionService {
    StudentCourseSectionRepository studentCourseSectionRepository;
    CourseSectionRepository courseSectionRepository;
    UserRepository userRepository;
    CourseSectionMapper courseSectionMapper;

    @Transactional
    public void register(RegisterCourseSection request) {
        User user = resolveUserForRegister(request.getUserId());
        CourseSection courseSection = courseSectionRepository.findById(normalizeCode(request.getCourseSectionCode()))
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND));

        if (studentCourseSectionRepository.existsByUser_IdAndCourseSection_Code(user.getId(), courseSection.getCode())) {
            return;
        }
        StudentCourseSection join = new StudentCourseSection();
        join.setUser(user);
        join.setCourseSection(courseSection);
        studentCourseSectionRepository.save(join);
    }

    @Transactional
    public void unregister(String courseSectionCode) {
        User caller = getCallerUser();
        if (caller == null || caller.getId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String normalized = normalizeCode(courseSectionCode);
        studentCourseSectionRepository.deleteByUser_IdAndCourseSection_Code(caller.getId(), normalized);
    }

    public List<CourseSectionResponse> myCourseSections() {
        User caller = getCallerUser();
        if (caller == null || caller.getId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return studentCourseSectionRepository.findByUser_Id(caller.getId()).stream()
                .map(StudentCourseSection::getCourseSection)
                .map(courseSectionMapper::toCourseSectionResponse)
                .toList();
    }

    private User resolveUserForRegister(Long userIdFromRequest) {
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

