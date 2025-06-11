package com.sports.kickauction.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.service.SellerService;


import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    
    private final SellerService sellerService;
    
    @Value("${upload.path}")
    private String uploadBasePath;
    
    @GetMapping("/{mno}")
    public SellerReadDTO getSeller(@PathVariable Long mno) {
        return sellerService.getSellerByMno(mno);
    }

    @PostMapping("/register")
public ResponseEntity<?> registerSeller(
    @RequestPart("simage") MultipartFile[] simage,        // 대표 + 소개 이미지 통합 배열
    @RequestPart("info") String info,                     // 업체 정보
    @RequestPart("introContent") String introContent      // 업체 소개글
) {
    // 이미지 파일 저장
    List<String> savedFilePaths = new ArrayList<>();

    for (MultipartFile file : simage) {
        if (!file.getContentType().startsWith("image")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미지 파일만 업로드 가능");
        }

        try {
            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String saveName = uuid + "_" + originalName;

            Path savePath = Paths.get("C:/upload", saveName);
            file.transferTo(savePath.toFile());

            savedFilePaths.add(saveName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
        }
    }

    // DTO 생성
    SellerRegisterDTO dto = new SellerRegisterDTO();
    dto.setSimage(savedFilePaths); // 대표 + 소개 이미지 배열
    dto.setIntroContent(introContent);
    dto.setInfo(info);

    

    // TODO: 서비스 로직 처리
    return ResponseEntity.ok("등록 완료");
}
}
