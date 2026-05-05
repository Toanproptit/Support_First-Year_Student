package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.SubjectResponse;
import org.example.supportfirststudents.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {
    public SubjectResponse toSubjectResponse(Subject subject) {
        return SubjectResponse.builder()
                .code(subject.getCode())
                .name(subject.getName())
                .finalExamWeight(subject.getFinalExamWeight())
                .midtermWeight(subject.getMidtermWeight())
                .attendanceWeight(subject.getAttendanceWeight())
                .build();
    }
}
