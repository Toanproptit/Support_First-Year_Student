package org.example.supportfirststudents.mapper;

import org.example.supportfirststudents.dto.request.CreateTerm;
import org.example.supportfirststudents.dto.request.UpdateTerm;
import org.example.supportfirststudents.dto.response.TermResponse;
import org.example.supportfirststudents.entity.Term;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class TermMapper {
    public Term toEntity(CreateTerm request) {
        Term term = new Term();
        term.setCode(normalizeCode(request.getCode()));
        term.setName(normalize(request.getName()));
        term.setStartDate(request.getStartDate());
        term.setEndDate(request.getEndDate());
        return term;
    }

    public TermResponse toResponse(Term term) {
        return TermResponse.builder()
                .code(term.getCode())
                .name(term.getName())
                .startDate(term.getStartDate())
                .endDate(term.getEndDate())
                .build();
    }

    public void updateEntity(Term term, UpdateTerm request) {
        term.setName(normalize(request.getName()));
        term.setStartDate(request.getStartDate());
        term.setEndDate(request.getEndDate());
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeCode(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
    }
}

