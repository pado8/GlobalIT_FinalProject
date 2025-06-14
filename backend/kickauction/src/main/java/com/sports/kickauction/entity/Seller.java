package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "seller")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class Seller {

    @Id
    private Long mno;

    @OneToOne
    @JoinColumn(name = "mno")
    private Member member;

    private String sname;
    private String slocation;
}
