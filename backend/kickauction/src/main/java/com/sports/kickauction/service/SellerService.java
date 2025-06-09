package com.sports.kickauction.service;

import com.sports.kickauction.dto.SellerReadDTO;

public interface SellerService {
    SellerReadDTO getSellerByMno(Long mno);
}
