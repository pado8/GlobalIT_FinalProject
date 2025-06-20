import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/Authcontext";
import { getSellerDetail } from "../../api/SellerApi";
import "../mypage/MyPage.css";

const MyPage = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.mno) return;

      try {
        const data = await getSellerDetail(user.mno);
        setCompany({
          sname: data.sname,
          slocation: data.slocation,
        });
      } catch (err) {
        console.error("업체 정보 조회 실패:", err);
      }
    };

    fetchCompany();
  }, [user?.mno]);

  if (!user) return <p>로그인이 필요합니다.</p>;

  return (
    <div className="mypage_container">
      <h2 className="mypage_title">마이페이지</h2>

      {/* 회원 정보 */}
      <section className="mypage_section">
        <h3 className="section_title">· 회원정보</h3>
        <p className="user_name">
          <strong>{user.nickname}</strong> 님
        </p>
        <button className="blue_btn">회원정보 수정</button>
      </section>

      {/* 견적 정보 */}
      <section className="mypage_section">
        <h3 className="section_title">· 내 견적</h3>
        <button className="blue_btn">진행 중 / 완료된 견적 보러가기</button>
      </section>
    </div>
  );
};

export default MyPage;
