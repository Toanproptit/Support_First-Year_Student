package org.example.supportfirststudents.service;

import java.util.List;

import org.example.supportfirststudents.dto.response.ExamScheduleResponse;
import org.example.supportfirststudents.entity.ExamSchedule;
import org.example.supportfirststudents.mapper.ExamScheduleMapper;
import org.example.supportfirststudents.repository.ExamScheduleReposiotory;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {
    final ExamScheduleReposiotory examScheduleReposiotory;
    final ExamScheduleMapper examScheduleMapper;
    public List<ExamScheduleResponse> getExamSchedule(Long id){
        return examScheduleReposiotory.findCurrentExamSchedulesByUserId(id)
            .stream()
            .map(examScheduleMapper::toRespone)
            .toList();
    }
}
