package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Biz;



public interface BizRepository extends JpaRepository<Biz, Long> {
  boolean existsBySeller_MnoAndRequest_Ono(Long mno, Long ono);
}
