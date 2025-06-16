package com.sports.kickauction.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getLoginUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인되지 않음");
        }

        String userId = authentication.getName(); 
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        // 닉네임 포함 반환
        return ResponseEntity.ok(Map.of(
            "userId", member.getUserId(),
            "nickname", member.getUserName()
        ));
    }
}
