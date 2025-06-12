package com.sports.kickauction.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;


import jakarta.transaction.Transactional;

@SpringBootTest
public class MemberRepositoyTests {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Test
    @Transactional
    @Rollback(false)
    public void testRegisterMemberAndSeller() {
        // 1. Member 생성
        Member member = Member.builder()
                .userId("testuser01")
                .userPw("1234")
                .userName("홍길동")
                .phone("010-1111-2222")
                .role(1)
                .social("none")
                .build();

        memberRepository.save(member);  // 먼저 저장 (PK 생성)

        // 2. Seller 생성 (Member PK를 FK로 사용)
        Seller seller = Seller.builder()
                .member(member)
                .sname("테스트 업체")
                .slocation("서울시 강남구")
                .build();

        sellerRepository.save(seller);  // Seller에도 mno가 들어감
  }
}
