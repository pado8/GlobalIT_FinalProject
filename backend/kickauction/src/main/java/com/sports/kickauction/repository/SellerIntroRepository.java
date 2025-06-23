package com.sports.kickauction.repository;

import com.sports.kickauction.entity.Seller;
import com.sports.kickauction.entity.SellerIntro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SellerIntroRepository extends JpaRepository<SellerIntro, Long> {

    boolean existsBySeller(Seller seller);

    // simage가 null이 아닌 모든 값 조회
    @Query("SELECT s.simage FROM SellerIntro s WHERE s.simage IS NOT NULL")
    List<String> findAllImagePaths();
}
