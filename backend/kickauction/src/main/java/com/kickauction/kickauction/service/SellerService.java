package com.kickauction.kickauction.service;

import com.kickauction.kickauction.dto.SellerReadDTO;

public interface SellerService {
    SellerReadDTO getSellerByMno(Long mno);
}
