package com.sports.kickauction.service;

import java.util.Collections;
import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(request);
 
        Map<String, Object> attributes = oauth2User.getAttributes();

        String email = (String) attributes.get("email");
        String baseNickname = (String) attributes.get("name");

        // 주석: 네임 중복 방지 
        String tempNickname = baseNickname;
        int count = 1;
        while (memberRepository.existsByUserName(tempNickname)) {
            tempNickname = baseNickname + count;
            count++;
        }
        final String finalNickname = tempNickname; // 람다 안에서 안전하게 사용 가능


        // 주석: 가입 확인
        Member member = memberRepository.findByUserId(email)
            .orElseGet(() -> {
                // 주석: 미가입시 회원가입
                Member newMember = Member.builder()
                    .userId(email)
                    .userPw("10101")
                    .userName(finalNickname)
                    .social(0) // 주석:0 =소셜
                    .role("USER")
                    .build();
                return memberRepository.save(newMember);
            });

        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority(member.getRole())),
            attributes,
            "email" 
        );
    }
}