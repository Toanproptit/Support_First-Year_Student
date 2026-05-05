package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateFaculty;
import org.example.supportfirststudents.dto.response.FacultyResponse;
import org.example.supportfirststudents.entity.Faculty;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.FacultyMapper;
import org.example.supportfirststudents.repository.FacultyRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FacultyService {
    FacultyRepository facultyRepository;
    FacultyMapper facultyMapper;

    @Transactional
    public FacultyResponse createFaculty(CreateFaculty request) {
        String code = normalizeCode(request.getCode());
        validateCodeNotExists(code);

        Faculty faculty = facultyMapper.toFaculty(request);
        return facultyMapper.toFacultyResponse(facultyRepository.save(faculty));
    }

    public FacultyResponse getFacultyByCode(String code) {
        return facultyMapper.toFacultyResponse(findFacultyByCode(code));
    }

    public List<FacultyResponse> getAllFaculties() {
        return facultyRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(facultyMapper::toFacultyResponse)
                .toList();
    }

    private Faculty findFacultyByCode(String code) {
        return facultyRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new Appexception(ErrorCode.FACULTY_NOT_FOUND));
    }

    private void validateCodeNotExists(String code) {
        if (facultyRepository.existsById(code)) {
            throw new Appexception(ErrorCode.FACULTY_CODE_EXISTED);
        }
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
