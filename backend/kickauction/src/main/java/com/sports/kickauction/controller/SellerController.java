package com.sports.kickauction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sports.kickauction.dto.SellerPageRequestDTO;
import com.sports.kickauction.dto.SellerPageResponseDTO;
import com.sports.kickauction.dto.SellerReadDTO;
import com.sports.kickauction.dto.SellerRegisterDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.repository.MemberRepository;
import com.sports.kickauction.service.SellerService;


import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    
    private final SellerService sellerService;
    private final MemberRepository memberRepository;
    
    @GetMapping("/list")
    public ResponseEntity<SellerPageResponseDTO<SellerReadDTO>> getSellerList(SellerPageRequestDTO sellerPageRequestDTO) {
        SellerPageResponseDTO<SellerReadDTO> result = sellerService.getSellerList(sellerPageRequestDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/detail/{mno}")
    public SellerReadDTO getSeller(@PathVariable Long mno) {
        return sellerService.getSellerByMno(mno);
    }

    @PostMapping("/register/{mno}")
    public ResponseEntity<?> registerSeller(@PathVariable Long mno,@RequestBody SellerRegisterDTO dto) {
        //  회원 존재 여부 확인
        Member member = memberRepository.findById(mno)
            .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        //  role 체크: 업체회원(role == 1)만 허용
        if (member.getRole() != "Seller") {
            return ResponseEntity.status(403).body("업체 회원만 등록할 수 있습니다.");
        }

        try {
            sellerService.registerSeller(mno, dto);
            return ResponseEntity.ok("등록 완료");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/registered/{mno}")
    public ResponseEntity<Boolean> checkRegistered(@PathVariable Long mno) {
        return ResponseEntity.ok(sellerService.isAlreadyRegistered(mno));
    }
   
}
   

