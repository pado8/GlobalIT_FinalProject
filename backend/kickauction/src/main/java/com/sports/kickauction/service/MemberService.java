package com.sports.kickauction.service;

import com.sports.kickauction.dto.MemberSellerDTO;

public interface MemberService {
  Long registerMember(MemberSellerDTO dto);
}
