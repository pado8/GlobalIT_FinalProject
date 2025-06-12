package com.sports.kickauction.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    @PostMapping("/register/{mno}")
public ResponseEntity<?> registerSeller(
    @PathVariable Long mno,
    @RequestPart(value = "simage", required = false) MultipartFile[] simage,
    @RequestPart("info") String info,
    @RequestPart("introContent") String introContent
) {
    List<String> savedFilePaths = new ArrayList<>();

    if (simage != null) {
        for (MultipartFile file : simage) {
            if (file.getContentType() == null || !file.getContentType().startsWith("image")) {
                return ResponseEntity.badRequest().body("이미지 파일만 업로드 가능");
            }

            try {
                String saveName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                String folderPath = makeFolder();
                Path savePath = Paths.get(uploadBasePath, folderPath, saveName);
                file.transferTo(savePath.toFile());
                savedFilePaths.add(folderPath + "/" + saveName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 저장 실패");
            }
        }
    }

    SellerRegisterDTO dto = new SellerRegisterDTO();
    dto.setSimage(savedFilePaths);
    dto.setIntroContent(introContent);
    dto.setInfo(info);
    sellerService.registerSeller(mno, dto);

    return ResponseEntity.ok("등록 완료");
}

    private String makeFolder() {
    String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    String folderPath = str.replace("/", File.separator);

    File uploadPathFolder = new File(uploadBasePath, folderPath);

    if (!uploadPathFolder.exists()) {
        uploadPathFolder.mkdirs(); // 필요한 하위 디렉토리까지 생성
    }

    return folderPath; // 날짜 경로만 반환 (ex: 2025/06/12)
}
}
