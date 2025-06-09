package com.kickauction.kickauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerReadDTO {
    private Long mno;
    private String sname;
    private String slocation;

    // 소개 정보
    private String introContent;
    private String simage;
    private int hiredCount;
    private String info;
}
