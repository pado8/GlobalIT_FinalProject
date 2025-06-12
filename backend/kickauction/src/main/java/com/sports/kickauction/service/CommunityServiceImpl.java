package com.sports.kickauction.service;

import java.util.stream.Collectors;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.entity.Community;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    private final ModelMapper modelMapper;
    private final CommunityRepository communityRepository;

    // 게시글 등록
    @Override
    public Long register(CommunityDTO communityDTO) {
        log.info("DTO → Entity 매핑: {}", communityDTO);

        // 기본값 처리
        if (communityDTO.getView() == null) {
            communityDTO.setView(0);
        }
        if (communityDTO.getPimage() == null) {
            communityDTO.setPimage("");
        }

        Community community = modelMapper.map(communityDTO, Community.class);
        Community saved = communityRepository.save(community);
        return saved.getPno();
    }

    // 게시글 조회
    @Override
    @Transactional(readOnly = true)
    public CommunityDTO get(Long pno) {
        log.info("ID로 조회: {}", pno);
        Community community = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 없습니다."));
        return modelMapper.map(community, CommunityDTO.class);
    }

    // 게시글 수정
    @Override
    public void modify(CommunityDTO communityDTO) {
        log.info("수정 요청 DTO: {}", communityDTO);
        Long pno = communityDTO.getPno();

        Community community = communityRepository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException(pno + "번 게시글이 없습니다."));

        // 변경 가능한 필드만
        community.changePtitle(communityDTO.getPtitle());
        community.changePcontent(communityDTO.getPcontent());
        community.changePimage(communityDTO.getPimage());

        if (communityDTO.getView() != null) {
            community.setView(communityDTO.getView());
        }

        communityRepository.save(community);
    }

    // 게시글 삭제
    @Override
    public void remove(Long pno) {
        log.info("삭제 요청 ID: {}", pno);
        communityRepository.deleteById(pno);
    }

    // 게시글 목록 조회 (페이징)
    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("목록 요청: {}", pageRequestDTO);

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        Page<Community> result = communityRepository.findAll(pageable);

        List<CommunityDTO> dtoList = result.getContent().stream()
                .map(community -> modelMapper.map(community, CommunityDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<CommunityDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }
}
