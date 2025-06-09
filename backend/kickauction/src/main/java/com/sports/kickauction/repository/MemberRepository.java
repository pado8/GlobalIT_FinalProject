package com.sports.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sports.kickauction.entity.Member;



public interface MemberRepository extends JpaRepository<Member,Long>{

}
