package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sports.kickauction.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // ono(=PK) 기준 저장/조회
}
