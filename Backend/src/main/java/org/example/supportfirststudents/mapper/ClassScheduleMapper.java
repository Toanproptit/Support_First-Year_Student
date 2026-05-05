package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.response.ClassScheduleResponse;
import org.example.supportfirststudents.entity.ClassSchedule;
import org.springframework.stereotype.Component;

@Component
public class ClassScheduleMapper {
    public ClassScheduleResponse toResponse(ClassSchedule classSchedule) {
        return ClassScheduleResponse.builder()
                .lessonNumber(classSchedule.getId().getLessonNumber())
                .courseSectionCode(classSchedule.getCourseSection().getCode())
                .subjectName(classSchedule.getCourseSection().getSubject().getName())
                .classDate(classSchedule.getClassDate())
                .dayOfWeek(classSchedule.getDayOfWeek())
                .startTime(classSchedule.getStartTime())
                .endTime(classSchedule.getEndTime())
                .room(classSchedule.getRoom())
                .build();
    }
}
