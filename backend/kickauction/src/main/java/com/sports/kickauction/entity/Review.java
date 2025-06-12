package com.sports.kickauction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "review")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Review extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno;

    @ManyToOne
    @JoinColumn(name = "mno")
    private Member member;

    @OneToOne
    @JoinColumn(name = "ono")
    private Order order;

    private String rtitle;
    private String rcontent;
    private String rimage;
}
