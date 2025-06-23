// pages/request/OrderReadPage.js
import React, { useEffect, useState } from 'react'; // useEffect와 useState 임포트
import { useParams } from 'react-router-dom'; // useParams 임포트
import axios from 'axios'; // axios 임포트

import BContentP11 from "../../components/requestComponents/bContentP11";
import Hero from "../../components/requestComponents/bHero";

const heroContent = {
  mainTitle: "견적 상세",
  subTitle: "지금 KICK!",
  notion: "KICK AUCTION이 중개합니다"
};

const OrderReadPage = () => {
  const { ono } = useParams(); // URL에서 ono 값 가져오기
  const [quoteDetail, setQuoteDetail] = useState(null); // 견적 상세 정보 상태
  const [companies, setCompanies] = useState([]); // 업체 제안 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchOrderDetails = async () => {

      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
        const response = await axios.get(`/api/orders/${ono}`); // 백엔드 API 호출
        const data = response.data;

        const now = new Date();
        const regDate = new Date(data.oregdate);
        const deadline = new Date(regDate);
        deadline.setDate(regDate.getDate() + 7);
        deadline.setHours(regDate.getHours()); // 시간 보정

        const timeLeft = deadline - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const timeLeftStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;

        setQuoteDetail({
          playType: data.playType, 
          region: data.region,
          rentalDate: data.rentalDate,
          rentalTime: data.rentalTime,
          person: data.person,
          rentalEquipment: data.rentalEquipment,
          ocontent: data.ocontent,
          oregdate: data.oregdate,
          finished: data.finished,
          timeLeftStr: timeLeftStr,
        });

        // NOTE :
        // 업체 목록 데이터 별도의 API 필요.
        setCompanies(data.companies || []); // 백엔드 응답에 companies 필드가 있다고 가정

      } catch (err) {
        setError("r : 견적 정보를 불러오는 데 실패했습니다.");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false); // 데이터 가져오기 완료 시 로딩 상태 false
      }
    };

    if (ono) { // ono 값이 있을 때만 API 호출
      fetchOrderDetails();
    }
  }, [ono]); // ono 값이 변경될 때마다 useEffect 재실행


  // 남은 시간 업데이트 훅
  useEffect(() => {
    if (!quoteDetail) return;

    const interval = setInterval(() => {
      const now = new Date();
      const regDate = new Date(quoteDetail.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours()); // 시간 보정

      const timeLeft = deadline - now;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setQuoteDetail((prev) => ({
        ...prev,
        timeLeftStr: `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`,
      }));
    }, 1000); // 1초마다 갱신

    return () => clearInterval(interval); // 언마운트 시 정리
  }, [quoteDetail]); // quoteDetail 바뀔 때마다 타이머 리설팅



  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!quoteDetail) return <div className="text-center mt-20">견적 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="bg-cover bg-center min-h-screen pt-12">
        <Hero {...heroContent} />
        {/* quoteDetail이 로드된 후에만 BContentP11 렌더링 */}
        <BContentP11 quote={quoteDetail} companies={companies} />
      </div>
    </>
  );
};

export default OrderReadPage;
