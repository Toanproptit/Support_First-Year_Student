package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.SubjectResponse;
import org.example.supportfirststudents.entity.Subject;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.SubjectMapper;
import org.example.supportfirststudents.repository.SubjectRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectService {
    SubjectRepository subjectRepository;
    SubjectMapper subjectMapper;

    public SubjectResponse getSubjectByCode(String code) {
        return subjectMapper.toSubjectResponse(findSubjectByCode(code));
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(subjectMapper::toSubjectResponse)
                .toList();
    }

    private Subject findSubjectByCode(String code) {
        return subjectRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new Appexception(ErrorCode.SUBJECT_NOT_FOUND));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
