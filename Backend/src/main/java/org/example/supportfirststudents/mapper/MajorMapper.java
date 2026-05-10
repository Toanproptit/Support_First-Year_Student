package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateMajor;
import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.entity.Faculty;
import org.example.supportfirststudents.entity.Major;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MajorMapper {
    public Major toMajor(CreateMajor request, Faculty faculty) {
        Major major = new Major();
        major.setCode(normalizeCode(request.getCode()));
        major.setName(normalize(request.getName()));
        major.setFaculty(faculty);
        return major;
    }

    public MajorResponse toMajorResponse(Major major) {
        return MajorResponse.builder()
                .code(major.getCode())
                .name(major.getName())
                .facultyCode(major.getFaculty() == null ? null : major.getFaculty().getCode())
                .build();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeCode(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }
}
