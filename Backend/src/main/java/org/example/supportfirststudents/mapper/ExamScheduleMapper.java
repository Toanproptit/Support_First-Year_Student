package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.ExamScheduleResponse;
import org.example.supportfirststudents.entity.ExamSchedule;
import org.springframework.stereotype.Component;

@Component
public class ExamScheduleMapper {
    public ExamScheduleResponse toRespone(ExamSchedule examSchedule){
        return ExamScheduleResponse.builder()
            .examDate(examSchedule.getExamDate())
            .startTime(examSchedule.getStartTime())
            .endTime(examSchedule.getEndTime())
            .examRoom(examSchedule.getExamRoom())
            .examFormat(examSchedule.getExamFormat())
            .subjectName(examSchedule.getCourseSection().getSubject().getName())
            .build();
    }
}
