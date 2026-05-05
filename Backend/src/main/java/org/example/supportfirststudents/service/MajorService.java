package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.entity.Major;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.Appexception;
import org.example.supportfirststudents.mapper.MajorMapper;
import org.example.supportfirststudents.repository.MajorRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MajorService {
    MajorRepository majorRepository;
    MajorMapper majorMapper;

    public MajorResponse getMajorByCode(String code) {
        return majorMapper.toMajorResponse(findMajorByCode(code));
    }

    public List<MajorResponse> getAllMajors() {
        return majorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(majorMapper::toMajorResponse)
                .toList();
    }

    private Major findMajorByCode(String code) {
        return majorRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new Appexception(ErrorCode.MAJOR_NOT_FOUND));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}
