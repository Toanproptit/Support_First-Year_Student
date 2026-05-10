package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.dto.request.CreateTerm;
import org.example.supportfirststudents.dto.request.UpdateTerm;
import org.example.supportfirststudents.dto.response.TermResponse;
import org.example.supportfirststudents.entity.Term;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.TermMapper;
import org.example.supportfirststudents.repository.TermRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TermService {
    TermRepository termRepository;
    TermMapper termMapper;

    @Transactional
    public TermResponse create(CreateTerm request) {
        String code = normalizeCode(request.getCode());
        if (termRepository.existsById(code)) {
            throw new AppException(ErrorCode.TERM_CODE_EXISTED);
        }
        Term term = termMapper.toEntity(request);
        return termMapper.toResponse(termRepository.save(term));
    }

    public TermResponse getByCode(String code) {
        return termMapper.toResponse(findByCode(code));
    }

    public List<TermResponse> getAll() {
        return termRepository.findAll(Sort.by(Sort.Direction.DESC, "code")).stream()
                .map(termMapper::toResponse)
                .toList();
    }

    @Transactional
    public TermResponse update(String code, UpdateTerm request) {
        Term term = findByCode(code);
        termMapper.updateEntity(term, request);
        return termMapper.toResponse(termRepository.save(term));
    }

    @Transactional
    public void delete(String code) {
        String normalized = normalizeCode(code);
        if (!termRepository.existsById(normalized)) {
            throw new AppException(ErrorCode.TERM_NOT_FOUND);
        }
        termRepository.deleteById(normalized);
    }

    private Term findByCode(String code) {
        return termRepository.findById(normalizeCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.TERM_NOT_FOUND));
    }

    private String normalizeCode(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }
}

