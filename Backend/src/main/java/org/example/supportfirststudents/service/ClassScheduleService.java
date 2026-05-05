package org.example.supportfirststudents.service;

import lombok.RequiredArgsConstructor;
import org.example.supportfirststudents.dto.response.ClassScheduleResponse;
import org.example.supportfirststudents.mapper.ClassScheduleMapper;
import org.example.supportfirststudents.repository.ClassScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassScheduleService {
    final ClassScheduleRepository classScheduleRepository;
    final ClassScheduleMapper classScheduleMapper;

    public List<ClassScheduleResponse> getClassSchedulesByUser(Long userId) {
        return classScheduleRepository.findClassSchedulesByUserId(userId)
                .stream()
                .map(classScheduleMapper::toResponse)
                .toList();
    }
}
