// AuthController.java
package com.sports.kickauction.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.service.MemberDetails;

import java.util.Map;

@RestController
public class AuthController {

    @GetMapping("/api/auth/check")
    public ResponseEntity<?> checkAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인 필요");
        }

        MemberDetails user = (MemberDetails) authentication.getPrincipal();

        return ResponseEntity.ok(Map.of(
            "mno", user.getMember().getMno(),
            "username", user.getUsername(),
            "role", user.getMember().getRole()  // 0: 일반, 1: 업체
        ));
    }
}
