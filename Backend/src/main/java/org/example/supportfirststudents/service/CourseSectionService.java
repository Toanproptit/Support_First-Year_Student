package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.CourseSectionResponse;
import org.example.supportfirststudents.entity.CourseSection;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.CourseSectionMapper;
import org.example.supportfirststudents.repository.CourseSectionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseSectionService {
    CourseSectionRepository courseSectionRepository;
    CourseSectionMapper courseSectionMapper;

    public CourseSectionResponse getCourseSectionByCode(String code) {
        return courseSectionMapper.toCourseSectionResponse(findCourseSectionByCode(code));
    }

    public List<CourseSectionResponse> getAllCourseSections() {
        return courseSectionRepository.findAll(Sort.by(Sort.Direction.ASC, "code"))
                .stream()
                .map(courseSectionMapper::toCourseSectionResponse)
                .toList();
    }

    private CourseSection findCourseSectionByCode(String code) {
        return courseSectionRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new Appexception(ErrorCode.COURSE_SECTION_NOT_FOUND));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
