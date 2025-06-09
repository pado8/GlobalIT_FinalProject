package com.sports.kickauction.service;

import org.springframework.stereotype.Service;

import com.sports.kickauction.dto.MemberSellerDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.repository.SellerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
  
  private final MemberRepository memberRepository;
  private final SellerRepository sellerRepository;
  
  @Transactional
  @Override
  public Long registerMember(MemberSellerDTO dto) {
    Member member = Member.builder()
                .userId(dto.getUserId())
                .userPw(dto.getUserPw())
                .userName(dto.getUserName())
                .phone(dto.getPhone())
                .role(1)
                .social("none")
                .build();

        memberRepository.save(member);

        Seller seller = Seller.builder()
                .member(member)
                .sname(dto.getSname())
                .slocation(dto.getSlocation())
                .build();

        sellerRepository.save(seller);

        return member.getMno();
  }

}
