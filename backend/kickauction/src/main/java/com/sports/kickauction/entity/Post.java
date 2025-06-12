// package com.kickauction.kickauction.entity;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.ToString;

// @Entity
// @Table(name = "post")
// @Getter
// @ToString
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor 
// public class Post extends BaseEntity{

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long pno;

//     @ManyToOne
//     @JoinColumn(name = "mno")
//     private Member member;

//     private String ptitle;
//     private String pcontent;
//     private int pview;
//     private String pimage;
// }
