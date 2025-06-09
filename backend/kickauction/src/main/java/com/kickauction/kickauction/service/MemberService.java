package com.kickauction.kickauction.service;

import com.kickauction.kickauction.dto.MemberSellerDTO;

public interface MemberService {
  Long registerMember(MemberSellerDTO dto);
}
