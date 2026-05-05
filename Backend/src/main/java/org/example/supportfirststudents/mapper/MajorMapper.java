package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.MajorResponse;
import org.example.supportfirststudents.entity.Major;
import org.springframework.stereotype.Component;

@Component
public class MajorMapper {
    public MajorResponse toMajorResponse(Major major) {
        return MajorResponse.builder()
                .code(major.getCode())
                .name(major.getName())
                .build();
    }
}
