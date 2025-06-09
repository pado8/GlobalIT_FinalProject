package com.sports.kickauction.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sports.kickauction.community.Community;
// import com.sports.kickauction.dto.PageRequestDTO;
// import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    // 자동주입 대상은 final로
    private final ModelMapper modelMapper;

    private final CommunityRepository todoRepository;

    @Override
    public Long register(CommunityDTO communityDTO) {

        log.info(".........");

        Community todo = modelMapper.map(communityDTO, Community.class);

        Community savedTodo = todoRepository.save(todo);

        return savedTodo.getId();

    }

    // @Override
    // public CommunityDTO get(Long pno) {

    //     java.util.Optional<Community> result = todoRepository.findById(pno);

    //     Community todo = result.orElseThrow();

    //     CommunityDTO dto = modelMapper.map(todo, CommunityDTO.class);

    //     return dto;
    // }

    // @Override
    // public void modify(CommunityDTO communityDTO) {

    //     Optional<Community> result = todoRepository.findById(communityDTO.getTno());

    //     Community todo = result.orElseThrow();

    //     todo.changeTitle(communityDTO.getTitle());
    //     todo.changeDueDate(communityDTO.getDueDate());
    //     todo.changeComplete(communityDTO.isComplete());

    //     todoRepository.save(todo);

    // }

    // @Override
    // public void remove(Long tno) {

    //     todoRepository.deleteById(tno);

    // }

    // @Override
    // public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO) {

    //     Pageable pageable = PageRequest.of(
    //             pageRequestDTO.getPage() - 1, // 1페이지가 0이므로 주의
    //             pageRequestDTO.getSize(),
    //             Sort.by("tno").descending());

    //     Page<Community> result = todoRepository.findAll(pageable);

    //     List<CommunityDTO> dtoList = result.getContent().stream()
    //             .map(todo -> modelMapper.map(todo, CommunityDTO.class))
    //             .collect(Collectors.toList());

    //     long totalCount = result.getTotalElements();

    //     PageResponseDTO<CommunityDTO> responseDTO = PageResponseDTO.<CommunityDTO>withAll()
    //             .dtoList(dtoList)
    //             .pageRequestDTO(pageRequestDTO)
    //             .totalCount(totalCount)
    //             .build();

    //     return responseDTO;
    // }

}
