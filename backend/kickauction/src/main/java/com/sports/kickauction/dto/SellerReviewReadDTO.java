package com.sports.kickauction.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerReviewReadDTO {
    private Long mno;              // 업체 번호
    private String username;       // 작성자 닉네임
    private int rating;            // 별점 (예: 8 → 4.0점)
    private String rcontent;       // 리뷰 내용
    private LocalDateTime regdate; // 등록일


 // 생성자 기반 DTO Projection용 생성자
    public SellerReviewReadDTO(Long mno, String nickname, Integer rating, String rcontent, LocalDateTime regdate) {
        this.mno = mno;
        this.username = username;
        this.rating = rating;
        this.rcontent = rcontent;
        this.regdate = regdate;
    }
}
