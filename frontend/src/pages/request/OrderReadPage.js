// 상세보기
import React, { useEffect, useState, useRef } from 'react'; // useRef 추가
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';

import BContentP11 from "../../components/requestComponents/bContentP11";
import Hero from "../../components/requestComponents/bHero";

const heroContent = {
  mainTitle: "견적 상세",
  subTitle: "지금 KICK!",
  notion: "KICK AUCTION이 중개합니다"
};

const OrderReadPage = () => {
  const { ono } = useParams();
  const [quoteDetail, setQuoteDetail] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 마감 처리 요청 중복 방지용 ref
  const isFinishingRef = useRef(false); 

  // 견적 상세 정보를 불러오는 함수
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // 백엔드 API 호출 - `/api/orders/${ono}`는 baseURL 또는 proxy를 통해 8080으로 연결됩니다.
      const response = await axios.get(`/api/orders/${ono}`, { withCredentials: true });
      const data = response.data;

      const now = new Date();
      const regDate = new Date(data.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours()); 
      deadline.setMinutes(regDate.getMinutes()); // 분, 초까지 정확하게 반영
      deadline.setSeconds(regDate.getSeconds());

      const timeLeft = deadline - now;
      let timeStr = "";
      let isUrgent = false;

      // 마감 여부 판단 (서버에서 받은 finished 상태와 클라이언트 계산 시간 비교)
      let currentFinishedStatus = data.finished; 
      if (timeLeft <= 0) {
        timeStr = "마감됨";
        currentFinishedStatus = true; // 시간이 지났으면 무조건 마감으로 간주
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        // timeStr = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
        if (days > 0) timeStr += `${days}일 `;
        if (hours > 0) timeStr += `${hours}시간 `;
        if (minutes > 0) timeStr += `${minutes}분 `;
        if (seconds > 0) timeStr += `${seconds}초`;
        
        isUrgent = timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0; // 12시간 미만 남았으면 긴급
      }

      setQuoteDetail({
        ...data, // 서버에서 받은 모든 데이터 포함
        timeLeftStr: timeStr,
        isUrgent: isUrgent,
        rawTimeLeft: timeLeft, // 남은 시간 원본 값
        finished: currentFinishedStatus, // 업데이트된 마감 상태
      });

      // 📍📍실제로 백엔드에서 받아오는 로직 구현 필요📍📍👀
      setCompanies(data.companies || []); 

    } catch (err) {
      setError("견적 정보를 불러오는 데 실패했습니다.");
      console.error("Error fetching order details:", err);
      // 에러 발생 시 navigate 처리 (예: 없는 견적 접근 시)
      if (err.response && err.response.status === 404) {
          navigate('/request'); // 견적 목록 페이지로 리다이렉트
          alert("존재하지 않는 견적입니다.");
      } else if (err.response && err.response.status === 401) {
          navigate('/'); // 로그인 페이지로 리다이렉트
          alert("로그인이 필요합니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 ono 변경 시 데이터 페치
  useEffect(() => {
    if (ono) {
      fetchOrderDetails();
    }
  }, [ono, navigate]); // navigate도 의존성 배열에 추가 (linter 경고 방지)

  // 남은 시간 업데이트 및 마감 처리 로직 (Interval)
  useEffect(() => {
    if (!quoteDetail || quoteDetail.finished) { // 이미 마감된 견적이면 타이머 불필요
      return; 
    }

    const interval = setInterval(async () => {
      const now = new Date();
      const regDate = new Date(quoteDetail.oregdate);
      const deadline = new Date(regDate);
      deadline.setDate(regDate.getDate() + 7);
      deadline.setHours(regDate.getHours());
      deadline.setMinutes(regDate.getMinutes()); 
      deadline.setSeconds(regDate.getSeconds());

      const timeLeft = deadline - now;

      // 마감 처리 로직: 시간이 0 이하이고 아직 서버에 마감 요청을 보내지 않은 경우
      if (timeLeft <= 0 && !isFinishingRef.current) {
        isFinishingRef.current = true; // 요청 시작 플래그 설정
        // console.log(`견적 ${ono} 마감! 서버에 PATCH 요청 보냄.`);
        
        try {
          // PATCH 요청은 withCredentials를 포함해야 CORS에러 안남.
          await axios.patch(`/api/orders/finish/${ono}`, {}, { withCredentials: true });
          // console.log(`견적 ${ono} 마감 처리 성공.`);
          
          // 성공 시, 클라이언트 상태의 finished 속성 업데이트
          setQuoteDetail(prev => ({
            ...prev,
            finished: true,
            timeLeftStr: "마감됨",
            isUrgent: false,
            rawTimeLeft: 0,
          }));
          clearInterval(interval); // 마감 처리 완료했으니 인터벌 중지
        } catch (err) {
          console.error(`견적 ${ono} 마감 처리 실패:`, err);
          if (err.response) {
            console.error("서버 응답 데이터:", err.response.data);
            console.error("서버 응답 상태 코드:", err.response.status);
          }
        } finally {
          isFinishingRef.current = false; // 요청 완료 플래그 초기화
        }
      } else if (timeLeft > 0) { // 아직 마감되지 않은 경우 시간 업데이트
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let timeStr = "";
        if (days > 0) timeStr += `${days}일 `;
        if (hours > 0) timeStr += `${hours}시간 `;
        if (minutes > 0) timeStr += `${minutes}분 `;
        if (seconds > 0) timeStr += `${seconds}초`;
        // 모두 0일 경우 기본값 설정
        if (timeStr.trim() === '') {
          timeStr = '0초';
        }

        setQuoteDetail((prev) => ({
          ...prev,
          timeLeftStr: timeStr,
          isUrgent: timeLeft < (1000 * 60 * 60 * 12) && timeLeft > 0,
          rawTimeLeft: timeLeft
        }));
      } else { // 시간이 0 이하인데 이미 마감 처리 되었거나 요청 중인 경우
        setQuoteDetail((prev) => ({
          ...prev,
          timeLeftStr: "마감됨",
          isUrgent: false,
          rawTimeLeft: 0
        }));
        clearInterval(interval); // 마감 상태면 인터벌 중지
      }
    }, 1000); // 1초마다 갱신

    // 컴포넌트 언마운트 시 또는 quoteDetail이 변경되어 인터벌이 재설정될 때 기존 인터벌 정리
    return () => clearInterval(interval);
  }, [quoteDetail, ono]); // quoteDetail과 ono가 바뀔 때마다 타이머 재설정

  // 로딩, 에러, 견적 없음 메시지
  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!quoteDetail) return <div className="text-center mt-20">견적 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <Hero {...heroContent} />
      <BContentP11 quote={quoteDetail} companies={companies} />
    </>
  );
};

export default OrderReadPage;