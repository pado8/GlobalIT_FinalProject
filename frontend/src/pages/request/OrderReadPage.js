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
  const [timeMap, setTimeMap] = useState({}); //남은 시간 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
        const response = await axios.get(`/api/orders/${ono}`); // 백엔드 API 호출
        const data = response.data;

        // // data.datetime이 존재하는지 먼저 확인
        // const rawDatetime = data.datetime;
        // let datePart = '';
        // let timePart = '시간협의가능';

        // if (rawDatetime) { // rawDatetime이 undefined, null, 빈 문자열이 아닌 경우에만 처리
        //   const parts = rawDatetime.split('|');
        //   if (parts.length > 0) {
        //     datePart = parts[0].trim().split(' ')[0]; // 날짜 부분 (공백으로 또 나눌 수 있으니 첫 번째만)
        //     if (parts.length > 1) {
        //       timePart = parts[1].trim(); // 시간 부분
        //     }
        //   } else {
        //     // '|'이 없을 경우 전체를 날짜로 간주하거나, 다른 처리
        //     datePart = rawDatetime.trim().split(' ')[0];
        //   }
        // }

        // 백엔드 OrderController의 getOrder 메서드에서 보내는 필드명에 맞게 매핑.
        
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


  // 남은 시간 업데이트 훅 ************** 수정 필요
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newTimeMap = {};

      const regDate = new Date(quoteDetail.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours()); // 시간 보정

      const timeLeft = deadline - now;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;

      newTimeMap[ono] = timeStr;

      setTimeMap(newTimeMap);
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
        <BContentP11 quote={quoteDetail} companies={companies} timeMap={timeMap}/>
        {/* <BContentP11 quote={quoteDetail} companies={companies} /> */}
      </div>
    </>
  );
};

export default OrderReadPage;
