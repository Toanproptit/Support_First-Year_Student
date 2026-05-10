package org.example.supportfirststudents.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.CreateClub;
import org.example.supportfirststudents.dto.response.ClubResponse;
import org.example.supportfirststudents.dto.response.PageResponse;
import org.example.supportfirststudents.entity.Club;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.ClubMapper;
import org.example.supportfirststudents.repository.ClubRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClubService {
    final ClubRepository clubRepository;
    final ClubMapper clubMapper;

    public ClubResponse getClubById(Long id) {
        return clubMapper.toClubResponse(getClub(id));
    }

    public List<ClubResponse> getAllClubs() {
        return clubRepository.findAll().stream().map(clubMapper::toClubResponse).toList();
    }

    public PageResponse<ClubResponse> getAllClubsPaged(int page, int size) {
        PageRequest pageable = buildPageRequest(page, size, Sort.by(Sort.Direction.ASC, "name"));
        Page<Club> clubPage = clubRepository.findAll(pageable);

        List<ClubResponse> content = clubPage.getContent()
                .stream()
                .map(clubMapper::toClubResponse)
                .toList();

        return PageResponse.<ClubResponse>builder()
                .results(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(clubPage.getTotalElements())
                .totalPages(clubPage.getTotalPages())
                .first(clubPage.isFirst())
                .last(clubPage.isLast())
                .build();
    }

    public ClubResponse createClub(CreateClub request) {
        Club club = clubMapper.toClub(request);
        clubRepository.save(club);
        return clubMapper.toClubResponse(club);
    }
    public ClubResponse updateClub(Long id ,CreateClub request) {
        Club oldClub = getClub(id);
        oldClub = clubMapper.toClub(request);
        clubRepository.save(oldClub);
        return clubMapper.toClubResponse(oldClub);
    }
    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    public Club getClub(Long id){
        return clubRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CLUB_NOT_FOUND));
    }

    private PageRequest buildPageRequest(int page, int size, Sort sort) {
        int validatePage = Math.max(page, 0);
        int validateSize = size <= 0 ? 10 : Math.min(size, 100);
        return PageRequest.of(validatePage, validateSize, sort);
    }
}
