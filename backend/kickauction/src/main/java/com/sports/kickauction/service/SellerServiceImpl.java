package com.sports.kickauction.service;



import lombok.RequiredArgsConstructor;

import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;
import com.sports.kickauction.repository.SellerIntroRepository;
import com.sports.kickauction.repository.SellerRepository;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final SellerIntroRepository sellerIntroRepository;

@Override
public SellerReadDTO getSellerByMno(Long mno) {
    Seller seller = sellerRepository.findById(mno).orElse(null);
    if (seller != null && seller.getSellerIntro() != null) {
        SellerIntro intro = seller.getSellerIntro();

        return SellerReadDTO.builder()
                .mno(seller.getMno())
                .sname(seller.getSname())
                .slocation(seller.getSlocation())
                .introContent(intro.getIntroContent())
                .simage(intro.getSimage())
                .hiredCount(intro.getHiredCount())
                .info(intro.getInfo())
                .build();
    }
    return null;
}

@Transactional
@Override
public void registerSeller(Long mno, SellerRegisterDTO dto) {
    try {
        Seller seller = sellerRepository.findById(mno)
                .orElseThrow(() -> new NoSuchElementException("해당 회원 없음"));

        String simageCombined = String.join(",", dto.getSimage());

        SellerIntro sellerIntro = SellerIntro.builder()
                .seller(seller)
                .introContent(dto.getIntroContent())
                .info(dto.getInfo())
                .simage(simageCombined)
                .hiredCount(0)
                .build();

        sellerIntroRepository.save(sellerIntro);

        System.out.println("✅ 저장 성공!");
    } catch (Exception e) {
        System.out.println("❌ 등록 실패:");
        e.printStackTrace();
    }
}
}
