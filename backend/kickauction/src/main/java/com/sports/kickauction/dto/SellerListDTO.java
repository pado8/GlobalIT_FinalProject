package com.sports.kickauction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerListDTO {
    private Long mno;
    private String sname;
    private String slocation;
    private int hiredCount;
    private String simage;
}
