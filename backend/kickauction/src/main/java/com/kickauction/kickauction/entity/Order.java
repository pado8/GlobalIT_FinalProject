package com.kickauction.kickauction.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "orders")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class Order extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ono;

    @ManyToOne
    @JoinColumn(name = "mno")
    private Member member;

    private String olocation;
    private String playType;
    private LocalDate rentalDate;
    private LocalDate rentalTime;
    private int person;
    private String rentalEquipment;
    private String ocontent;
    private boolean finished;

}
