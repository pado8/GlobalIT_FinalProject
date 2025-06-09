package com.sports.kickauction.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "member")
@ToString
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mno;

    @Column(nullable = false, unique = true)
    private String userId;

    private String userPw;
    private String social;
    private Integer role;
    private String userName;
    private String phone;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private Seller seller;
}
