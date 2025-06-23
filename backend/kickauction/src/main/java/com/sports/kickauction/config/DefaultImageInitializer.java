package com.sports.kickauction.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;

@Component
@RequiredArgsConstructor
public class DefaultImageInitializer {

    @Value("${upload.path}")
    private String uploadPath;

    @PostConstruct
    public void init() throws IOException {
        // 1. default.png → /upload/default/
        Path defaultDir = Paths.get(uploadPath, "default");
        if (!Files.exists(defaultDir)) {
            Files.createDirectories(defaultDir);
        }
        copyIfNotExists("default.png", defaultDir);

        // 2. baseprofile.png → /upload/
        Path uploadRoot = Paths.get(uploadPath);
        copyIfNotExists("baseprofile.png", uploadRoot);
    }

    private void copyIfNotExists(String fileName, Path targetDir) throws IOException {
        Path target = targetDir.resolve(fileName);
        if (!Files.exists(target)) {
            ClassPathResource resource = new ClassPathResource("static/" + fileName);
            Files.copy(resource.getInputStream(), target);
            System.out.println("[기본 이미지] " + fileName + " 복사 완료 → " + target.toString());
        } else {
            System.out.println("[기본 이미지] " + fileName + " 이미 존재함");
        }
    }
}
