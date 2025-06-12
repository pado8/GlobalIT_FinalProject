package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "biz")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class Biz extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bno;

    @ManyToOne
    @JoinColumn(name = "mno")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "ono")
    private Order order;

    private int price;
    private String bcontent;
    private String banswer;
}
