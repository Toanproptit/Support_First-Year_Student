package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateFaculty;
import org.example.supportfirststudents.dto.response.FacultyResponse;
import org.example.supportfirststudents.entity.Faculty;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class FacultyMapper {
    public Faculty toFaculty(CreateFaculty request) {
        Faculty faculty = new Faculty();
        faculty.setName(normalize(request.getName()));
        faculty.setCode(normalizeCode(request.getCode()));
        return faculty;
    }

    public FacultyResponse toFacultyResponse(Faculty faculty) {
        return new FacultyResponse(
                faculty.getCode(),
                faculty.getName()
        );
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeCode(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }
}
