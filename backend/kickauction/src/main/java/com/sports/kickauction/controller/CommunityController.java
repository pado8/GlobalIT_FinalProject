package com.sports.kickauction.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.CommentDTO;
import com.sports.kickauction.dto.CommunityDTO;
import com.sports.kickauction.dto.PageRequestDTO;
import com.sports.kickauction.dto.PageResponseDTO;
import com.sports.kickauction.service.CommentService;
import com.sports.kickauction.service.CommunityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.core.Authentication;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/community")
public class CommunityController {
    private final CommunityService service;
    private final CommentService commentService;

    @GetMapping("/{pno}")
    public ResponseEntity<CommunityDTO> getOne(@PathVariable Long pno) {
        CommunityDTO dto = service.get(pno);

        // 2) 이전글 정보
        CommunityDTO prev = service.getPrevious(pno);
        if (prev != null) {
            dto.setPrevPno(prev.getPno());
            dto.setPrevTitle(prev.getPtitle());
        }

        // 3) 다음글 정보
        CommunityDTO next = service.getNext(pno);
        if (next != null) {
            dto.setNextPno(next.getPno());
            dto.setNextTitle(next.getPtitle());
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<CommunityDTO>> list(PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(service.list(pageRequestDTO), HttpStatus.OK);
    }

    // @PostMapping("/")
    // public Map<String, Long> register(@RequestBody CommunityDTO communityDTO) {
    // log.info("CommunityDTO: " + communityDTO);
    // Long pno = service.register(communityDTO);
    // return Map.of("PNO", pno);
    // }

    @PostMapping(value = "", // or "/" 동일하게 동작함
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Long>> register(
            @ModelAttribute CommunityDTO communityDTO,
            @RequestParam(value = "pimageFile", required = false) MultipartFile pimageFile) {
        // service.register는 CommunityDTO와 MultipartFile을 받아서 저장 후 DTO 리턴
        CommunityDTO saved = service.register(communityDTO, pimageFile);
        // 저장된 pno를 리턴
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("PNO", saved.getPno()));
    }

    @PutMapping("/{pno}")
    public Map<String, String> modify(
            @PathVariable(name = "pno") Long pno,
            @RequestBody CommunityDTO communityDTO) {
        communityDTO.setPno(pno);
        log.info("Modify: " + communityDTO);
        service.modify(communityDTO);
        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{pno}")
    public Map<String, String> remove(@PathVariable(name = "pno") Long pno) {
        log.info("Remove:  " + pno);
        service.remove(pno);
        return Map.of("RESULT", "SUCCESS");
    }

    // 1) 댓글 목록 조회 (로그인 없이 가능)
    @GetMapping("/{pno}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long pno) {
        try {
            var list = commentService.getComments(pno);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            log.error("댓글 로드 예외", e);
            Map<String, String> err = Map.of(
                    "message", e.getMessage(),
                    "trace", Arrays.stream(e.getStackTrace()).map(Object::toString).collect(Collectors.joining("\n")));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // 2) 댓글 등록 (로그인 필요)
    @PostMapping("/{pno}/comments")
    public ResponseEntity<CommentDTO> writeComment(
            @PathVariable Long pno,
            @RequestBody CommentDTO dto,
            Authentication auth) {
        CommentDTO saved = commentService.writeComment(pno, dto, auth);
        return ResponseEntity.ok(saved);
    }

}