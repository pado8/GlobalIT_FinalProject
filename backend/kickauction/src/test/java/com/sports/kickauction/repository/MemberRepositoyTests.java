package com.sports.kickauction.repository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;

import jakarta.transaction.Transactional;

@SpringBootTest
public class MemberRepositoyTests {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private SellerIntroRepository sellerIntroRepository;

    @Test
    @Transactional
    @Rollback(false)
    public void testRegisterMemberAndSeller() {
        // 1. Member 생성
        Member member = Member.builder()
                .userId("testuser01")
                .userPw("1234")
                .userName("홍길동")
                .phone("01011112222")
                .role(1)
                .social(0)
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
  @Test
@Transactional
@Rollback(false)
public void insertDummySellers() {
    List<String[]> imageGroups = List.of(
        new String[]{"922af823-ed2c-4787-a3e0-6b227f26bd3a.jpeg", "ba02049b-b0d5-4d02-a08e-cac3590676e.jpeg", "d547bfae-dfc8-4086-a264-724d76c70a36.jpeg","3644b811-6be0-447f-b644-14e8ec90e5ea.jpeg","bd4a2acb-6d8e-450f-9f52-99370be76b74.jpeg"},
        new String[]{"3644b811-6be0-447f-b644-14e8ec90e5ea.jpeg", "bd4a2acb-6d8e-450f-9f52-99370be76b74.jpeg", "extra1.jpeg"},
        new String[]{"seller1.jpeg", "seller1_intro1.jpeg", "seller1_intro2.jpeg"},
        new String[]{"seller2.jpeg", "seller2_intro1.jpeg", "seller2_intro2.jpeg"},
        new String[]{"seller3.jpeg", "seller3_intro1.jpeg", "seller3_intro2.jpeg"},
        new String[]{"seller4.jpeg", "seller4_intro1.jpeg", "seller4_intro2.jpeg"},
        new String[]{"seller5.jpeg", "seller5_intro1.jpeg", "seller5_intro2.jpeg"},
        new String[]{"seller6.jpeg", "seller6_intro1.jpeg", "seller6_intro2.jpeg"},
        new String[]{"seller7.jpeg", "seller7_intro1.jpeg", "seller7_intro2.jpeg"},
        new String[]{"seller8.jpeg", "seller8_intro1.jpeg", "seller8_intro2.jpeg"},
        new String[]{"seller9.jpeg", "seller9_intro1.jpeg", "seller9_intro2.jpeg"},
        new String[]{"seller10.jpeg", "seller10_intro1.jpeg", "seller10_intro2.jpeg"}
        
    );

    String prefix = "2025/06/13/";

    for (int i = 0; i < imageGroups.size(); i++) {
        Member member = Member.builder()
                .userId("testuser" + (i + 1))
                .userPw("1234")
                .userName("홍길동" + (i + 1))
                .phone("010123412" + String.format("%02d", i))
                .role(1)
                .social(0)
                .build();

        memberRepository.save(member);

        Seller seller = Seller.builder()
                .member(member)
                .sname("테스트업체" + (i + 1))
                .slocation("서울시 강남구 " + (i + 1) + "길")
                .build();

        sellerRepository.save(seller);

        // ✅ 경로 포함된 이미지 경로 문자열 생성
        String simage = Arrays.stream(imageGroups.get(i))
                              .map(name -> prefix + name)
                              .collect(Collectors.joining(","));

        SellerIntro intro = SellerIntro.builder()
                .seller(seller)
                .simage(simage)
                .info("이곳은 테스트 업체입니다 - info " + (i + 1))
                .introContent("테스트 소개글입니다 - intro " + (i + 1))
                .hiredCount((i + 1) * 2)
                .build();

        sellerIntroRepository.save(intro);
    }
}
        @Test
        @Transactional
        @Rollback(false)
        public void deleteAllDummySellers() {
        // 1. 먼저 SellerIntro 삭제
        sellerIntroRepository.deleteAll();

        // 2. Seller 삭제
        sellerRepository.deleteAll();

        // 3. 테스트용 Member 삭제 (userId가 testuser로 시작하는 것만)
        memberRepository.findAll().stream()
                .filter(member -> member.getUserId().startsWith("testuser"))
                .forEach(memberRepository::delete);
        }

         @Test
    @Transactional
    @Rollback(false)
    public void insertTestSellerAccount1() {
        Member member = Member.builder()
                .userId("sliderTestOnly")
                .userPw("1234")
                .userName("슬라이더계정")
                .phone("01098761234")
                .role(1)
                .social(0)
                .build();

        memberRepository.save(member);

        Seller seller = Seller.builder()
                .member(member)
                .sname("슬라이더 업체")
                .slocation("서울시 슬라이더구")
                .build();

        sellerRepository.save(seller);

        System.out.println("✅ 생성된 mno: " + member.getMno());
    }
        
}

