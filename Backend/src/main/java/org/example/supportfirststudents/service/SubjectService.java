package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateSubject;
import org.example.supportfirststudents.dto.request.UpdateSubject;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.dto.response.SubjectResponse;
import org.example.supportfirststudents.entity.Subject;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.SubjectMapper;
import org.example.supportfirststudents.repository.CourseSectionRepository;
import org.example.supportfirststudents.repository.SubjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectService {
    SubjectRepository subjectRepository;
    SubjectMapper subjectMapper;
    CourseSectionRepository courseSectionRepository;

    public SubjectResponse getSubjectByCode(String code) {
        return subjectMapper.toSubjectResponse(findSubjectByCode(code));
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(subjectMapper::toSubjectResponse)
                .toList();
    }

    public PageResponse<SubjectResponse> getAllSubjectsPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Subject> subjectPage = subjectRepository.findAll(pageable);

        List<SubjectResponse> content = subjectPage.getContent()
                .stream()
                .map(subjectMapper::toSubjectResponse)
                .toList();

        return PageResponse.<SubjectResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(subjectPage.getTotalElements())
                .totalPages(subjectPage.getTotalPages())
                .first(subjectPage.isFirst())
                .last(subjectPage.isLast())
                .build();
    }

    @Transactional
    public SubjectResponse create(CreateSubject request) {
        String code = normalizeCode(request.getCode());
        if (subjectRepository.existsById(code)) {
            throw new AppException(ErrorCode.SUBJECT_CODE_EXISTED);
        }

        Subject subject = new Subject();
        subject.setCode(code);
        subject.setName(request.getName().trim());
        subject.setFinalExamWeight(request.getFinalExamWeight());
        subject.setMidtermWeight(request.getMidtermWeight());
        subject.setAttendanceWeight(request.getAttendanceWeight());

        validateWeights(subject);
        return subjectMapper.toSubjectResponse(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectResponse update(String code, UpdateSubject request) {
        Subject subject = findSubjectByCode(code);

        if (request.getName() != null) {
            subject.setName(request.getName().trim());
        }
        if (request.getFinalExamWeight() != null) {
            subject.setFinalExamWeight(request.getFinalExamWeight());
        }
        if (request.getMidtermWeight() != null) {
            subject.setMidtermWeight(request.getMidtermWeight());
        }
        if (request.getAttendanceWeight() != null) {
            subject.setAttendanceWeight(request.getAttendanceWeight());
        }

        validateWeights(subject);
        return subjectMapper.toSubjectResponse(subjectRepository.save(subject));
    }

    @Transactional
    public void delete(String code) {
        String normalized = normalizeCode(code);
        if (!subjectRepository.existsById(normalized)) {
            throw new AppException(ErrorCode.SUBJECT_NOT_FOUND);
        }
        if (courseSectionRepository.existsBySubject_Code(normalized)) {
            throw new AppException(ErrorCode.SUBJECT_HAS_COURSE_SECTIONS);
        }
        subjectRepository.deleteById(normalized);
    }

    private Subject findSubjectByCode(String code) {
        return subjectRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
    }

    private void validateWeights(Subject subject) {
        Integer finalExam = subject.getFinalExamWeight();
        Integer midterm = subject.getMidtermWeight();
        Integer attendance = subject.getAttendanceWeight();

        if (finalExam == null && midterm == null && attendance == null) {
            return;
        }
        if (finalExam == null || midterm == null || attendance == null) {
            throw new AppException(ErrorCode.SUBJECT_WEIGHT_INVALID);
        }
        if (finalExam + midterm + attendance != 100) {
            throw new AppException(ErrorCode.SUBJECT_WEIGHT_INVALID);
        }
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }

    private PageRequest buildPageRequest(int page, int size, Sort sort) {
        int validatePage = Math.max(page, 0);
        int validateSize = size <= 0 ? 10 : Math.min(size, 100);
        return PageRequest.of(validatePage, validateSize, sort);
    }
}
