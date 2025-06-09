package com.kickauction.kickauction.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kickauction.kickauction.entity.Member;

public interface MemberRepository extends JpaRepository<Member,Long>{

}
