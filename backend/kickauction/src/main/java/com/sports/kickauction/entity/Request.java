package com.sports.kickauction.entity; // Recommended package for entities

import java.time.LocalDateTime; // JPA annotations

import jakarta.persistence.Column; // Lombok annotations
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;

@Entity // Specifies that this class is an entity
@Table(name = "`ORDER`")
@Setter
@ToString
@Getter
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@AllArgsConstructor // Lombok: Generates an all-argument constructor
@Builder // Lombok: Provides a builder pattern for object creation
public class Request {

    @Id // Specifies the primary key of an entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indicates that the primary key is auto-incremented by the database
    @Column(name = "ono") // Maps to the 'ono' column
    private int ono;

    @Column(name = "mno", nullable = false) // Maps to the 'mno' column, assuming it's not nullable
    private int mno;

    @Column(name = "play_type", length = 50, nullable = false) // Maps to 'play_type' column, VARCHAR(50)
    private String playType;

    @Column(name = "olocation", length = 100, nullable = false) // Maps to 'olocation' column, VARCHAR(100)
    private String olocation;

    @Column(name = "rental_date", columnDefinition = "DATETIME") // Maps to 'rental_date' column. Using DATETIME as DTO uses LocalDateTime.
    private LocalDateTime rentalDate;

    @Column(name = "rental_time", length = 50) // Maps to 'rental_time' column, VARCHAR(50)
    private String rentalTime;

    @Column(name = "person") // Maps to 'person' column (INT)
    private Integer person; // Use Integer for nullable int, though your DB implies not nullable

    @Column(name = "rental_equipment", columnDefinition = "TEXT") // Maps to 'rental_equipment' column. IMPORTANT: Changed from NUMBER to TEXT/VARCHAR in DB.
    private String rentalEquipment; // This should be TEXT or VARCHAR in your DB.

    @Column(name = "ocontent", columnDefinition = "TEXT") // Maps to 'ocontent' column (TEXT)
    private String ocontent;

    @Column(name = "oregdate", columnDefinition = "DATETIME", nullable = false, updatable = false) // Maps to 'oregdate'. Not nullable, not updatable.
    private LocalDateTime regdate;

    @Column(name = "finished", nullable = false) // Maps to 'finished' column, assuming not nullable
    private int finished;

}