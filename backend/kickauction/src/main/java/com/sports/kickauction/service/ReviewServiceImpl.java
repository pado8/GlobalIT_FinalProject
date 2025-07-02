package com.sports.kickauction.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sports.kickauction.entity.Review;
import com.sports.kickauction.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public void registerReview(Long ono, Long mno, Integer rating, String rcontent) {
        Review review = Review.builder()
                .ono(ono) // 주문번호를 PK로
                .mno(mno) // 판매자 회원번호
                .rating(rating) // 평점
                .rcontent(rcontent)// 리뷰 내용
                .build();
        reviewRepository.save(review);
    }

     @Override
    public Page<SellerReviewReadDTO> getReviewsBySeller(Long mno, Pageable pageable) {
        return repo.findByMno(mno, pageable)
                .map(this::toDTO);
    }

    private SellerReviewReadDTO toDTO(Review review) {
        return SellerReviewReadDTO.builder()
                .mno(review.getMno())
                .rating(review.getRating())
                .rcontent(review.getRcontent())
                .regdate(review.getRegDate())
                .build();
    }
}
