package com.sports.kickauction.service;

import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.dto.SellerReviewReadDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    void register(ReviewDTO dto);
    Page<SellerReviewReadDTO> getReviewsBySeller(Long mno, Pageable pageable);
}
