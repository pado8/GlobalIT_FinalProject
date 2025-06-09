package com.sports.kickauction.service;



import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.kickauction.kickauction.dto.SellerReadDTO;
import com.kickauction.kickauction.entity.Seller;
import com.kickauction.kickauction.entity.SellerIntro;
import com.sports.kickauction.repository.SellerRepository;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;

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
}
