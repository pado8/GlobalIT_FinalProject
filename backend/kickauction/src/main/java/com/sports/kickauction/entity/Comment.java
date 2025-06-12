// package com.sports.kickauction.entity;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.ToString;

// @Entity
// @Table(name = "comment")
// @Getter
// @ToString
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor 
// public class Comment extends BaseEntity{

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long cno;

//     @ManyToOne
//     @JoinColumn(name = "mno")
//     private Member member;

//     @ManyToOne
//     @JoinColumn(name = "pno")
//     private Post post;

//     private String ccontent;
//     private Long parentno;
// }
