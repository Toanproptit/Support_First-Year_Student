package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateCourseSection;
import org.example.supportfirststudents.dto.request.UpdateCourseSection;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.entity.CourseSection;
import org.example.supportfirststudents.entity.Major;
import org.example.supportfirststudents.entity.Subject;
import org.example.supportfirststudents.entity.Term;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.CourseSectionMapper;
import org.example.supportfirststudents.repository.CourseSectionRepository;
import org.example.supportfirststudents.repository.MajorRepository;
import org.example.supportfirststudents.repository.SubjectRepository;
import org.example.supportfirststudents.repository.TermRepository;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionService {
    CourseSectionRepository courseSectionRepository;
    CourseSectionMapper courseSectionMapper;
    TermRepository termRepository;
    MajorRepository majorRepository;
    SubjectRepository subjectRepository;
    UserRepository userRepository;

    public CourseSectionResponse getCourseSectionByCode(String code) {
        return courseSectionMapper.toCourseSectionResponse(findCourseSectionByCode(code));
    }

    public List<CourseSectionResponse> getAllCourseSections(String termCode, String majorCode, String subjectCode) {
        Sort sort = Sort.by(Sort.Direction.ASC, "code");
        List<CourseSection> list;
        if (termCode != null && majorCode != null && subjectCode != null) {
            list = courseSectionRepository.findAllByTerm_CodeAndMajor_CodeAndSubject_Code(
                    normalizeCode(termCode), normalizeCode(majorCode), normalizeCode(subjectCode), sort);
        } else if (termCode != null && majorCode != null) {
            list = courseSectionRepository.findAllByTerm_CodeAndMajor_Code(
                    normalizeCode(termCode), normalizeCode(majorCode), sort);
        } else if (termCode != null) {
            list = courseSectionRepository.findAllByTerm_Code(normalizeCode(termCode), sort);
        } else if (majorCode != null) {
            list = courseSectionRepository.findAllByMajor_Code(normalizeCode(majorCode), sort);
        } else if (subjectCode != null) {
            list = courseSectionRepository.findAllBySubject_Code(normalizeCode(subjectCode), sort);
        } else {
            list = courseSectionRepository.findAll(sort);
        }

        return list
                .stream()
                .map(courseSectionMapper::toCourseSectionResponse)
                .toList();
    }

    @Transactional
    public CourseSectionResponse create(CreateCourseSection request) {
        String code = normalizeCode(request.getCode());
        if (courseSectionRepository.existsById(code)) {
            throw new AppException(ErrorCode.COURSE_SECTION_CODE_EXISTED);
        }

        Term term = termRepository.findById(normalizeCode(request.getTermCode()))
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));
        Major major = majorRepository.findById(normalizeCode(request.getMajorCode()))
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));
        Subject subject = subjectRepository.findById(normalizeCode(request.getSubjectCode()))
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        User teacher = null;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }

        CourseSection cs = new CourseSection();
        cs.setCode(code);
        cs.setName(request.getName() == null ? null : request.getName().trim());
        cs.setMaxStudents(request.getMaxStudents());
        cs.setStartDate(request.getStartDate());
        cs.setEndDate(request.getEndDate());
        cs.setTerm(term);
        cs.setMajor(major);
        cs.setSubject(subject);
        cs.setTeacher(teacher);

        return courseSectionMapper.toCourseSectionResponse(courseSectionRepository.save(cs));
    }

    @Transactional
    public CourseSectionResponse update(String code, UpdateCourseSection request) {
        CourseSection cs = findCourseSectionByCode(code);

        Term term = termRepository.findById(normalizeCode(request.getTermCode()))
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));
        Major major = majorRepository.findById(normalizeCode(request.getMajorCode()))
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));
        Subject subject = subjectRepository.findById(normalizeCode(request.getSubjectCode()))
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        User teacher = null;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }

        cs.setName(request.getName() == null ? null : request.getName().trim());
        cs.setMaxStudents(request.getMaxStudents());
        cs.setStartDate(request.getStartDate());
        cs.setEndDate(request.getEndDate());
        cs.setTerm(term);
        cs.setMajor(major);
        cs.setSubject(subject);
        cs.setTeacher(teacher);

        return courseSectionMapper.toCourseSectionResponse(courseSectionRepository.save(cs));
    }

    @Transactional
    public void delete(String code) {
        CourseSection cs = findCourseSectionByCode(code);
        courseSectionRepository.delete(cs);
    }

    private CourseSection findCourseSectionByCode(String code) {
        return courseSectionRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_SECTION_NOT_FOUND));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
