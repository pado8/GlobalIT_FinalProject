package com.kickauction.kickauction.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kickauction.kickauction.dto.SellerReadDTO;
import com.kickauction.kickauction.service.SellerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @GetMapping("/{mno}")
    public SellerReadDTO getSeller(@PathVariable Long mno) {
        return sellerService.getSellerByMno(mno);
    }
}
