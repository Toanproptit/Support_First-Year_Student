package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateMajor;
import org.example.supportfirststudents.dto.request.UpdateMajor;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.entity.Faculty;
import org.example.supportfirststudents.entity.Major;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.MajorMapper;
import org.example.supportfirststudents.repository.FacultyRepository;
import org.example.supportfirststudents.repository.MajorRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MajorService {
    MajorRepository majorRepository;
    MajorMapper majorMapper;
    FacultyRepository facultyRepository;

    public MajorResponse getMajorByCode(String code) {
        return majorMapper.toMajorResponse(findMajorByCode(code));
    }

    public List<MajorResponse> getAllMajors() {
        return majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(majorMapper::toMajorResponse)
                .toList();
    }

    public List<MajorResponse> getMajorsByFacultyCode(String facultyCode) {
        return majorRepository.findAllByFaculty_Code(normalizeCode(facultyCode), Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(majorMapper::toMajorResponse)
                .toList();
    }

    @Transactional
    public MajorResponse createMajor(CreateMajor request) {
        String code = normalizeCode(request.getCode());
        validateCodeNotExists(code);

        Faculty faculty = findFacultyByCode(request.getFacultyCode());
        Major major = majorMapper.toMajor(request, faculty);
        return majorMapper.toMajorResponse(majorRepository.save(major));
    }

    @Transactional
    public MajorResponse updateMajor(String code, UpdateMajor request) {
        Major major = findMajorByCode(code);
        major.setName(request.getName() == null ? null : request.getName().trim());

        if (request.getFacultyCode() != null && !request.getFacultyCode().isBlank()) {
            Faculty faculty = findFacultyByCode(request.getFacultyCode());
            major.setFaculty(faculty);
        }

        return majorMapper.toMajorResponse(majorRepository.save(major));
    }

    @Transactional
    public void deleteMajor(String code) {
        Major major = findMajorByCode(code);
        majorRepository.delete(major);
    }

    private Major findMajorByCode(String code) {
        return majorRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));
    }

    private Faculty findFacultyByCode(String code) {
        return facultyRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.FACULTY_NOT_FOUND));
    }

    private void validateCodeNotExists(String code) {
        if (majorRepository.existsById(code)) {
            throw new AppException(ErrorCode.MAJOR_CODE_EXISTED);
        }
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
