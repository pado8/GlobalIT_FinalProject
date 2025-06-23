import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";



// 견적 상세보기
const BContentP11 = ({ quote, companies, timeMap }) => {
  const navigate = useNavigate();
  const { ono } = useParams(); // URL 파라미터 (견적 ID)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

// null 대비 매핑
  const displayDate = 
    quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';
  const displayTime = quote.rentalTime ? quote.rentalTime : '시간 null';
  const displayPerson = quote.person ? `${quote.person}명` : '인원 null';
  const displayRegion = quote.region ? `${quote.region}` : '지역 null';
  const displayRentalEquipment = quote.rentalEquipment ? `${quote.rentalEquipment}` : '대여 장비 미신청';
  const displayOcontent = quote.ocontent ? `${quote.ocontent}` : '요청사항이 없어요';



  //날짜 계산
  const regDateObj = new Date(quote.regdate); //base
  let endDateObj = new Date(quote.regdate);
  endDateObj = new Date(endDateObj.setDate(regDateObj.getDate() + 7)); //7일뒤. 시간은 00으로 초기화됨
  endDateObj.setHours(regDateObj.getHours()); // 원래 시간 설정

  const timeLeft = endDateObj - new Date(); //남은 시간 계산 (밀리초)
  const isUrgent = timeLeft < (1000*60*60*12) ? true : false;  // 12시간 이하면 true
  // let urgentStr = isUrgent===true?"True":"False"; //불리언 확인용

  const handleModifyClick = () => {
    navigate(`/request/modify/${ono}`);
  };
  const handleDeleteClick = () => {
     const response = axios.patch(`/api/orders/delete/${ono}`);
     console.log(response);

    navigate(`/request/list`);
  };
  const handleConfirmClick = async () => {
    if (!selectedCompanyId) {
      alert("업체를 선택해주세요.");
      return;
  }
    
    try {
      await axios.patch(`/api/orders/${ono}/select`, {
        companyId: selectedCompanyId,
      });
      alert("업체가 확정되었습니다!");
      navigate(`/request/list`);
    } catch (error) {
      console.error("업체 확정 오류:", error);
      alert("업체 확정에 실패했습니다.");
    }
  };

  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
      {/* 견적 제목 및 요약 */}
      <div className="mb-4 border-b pb-4">
        <div className="text-sm text-gray-600">현재 견적</div>
        <div className="font-bold text-lg mt-1">신청 종목 : {quote.playType}</div>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
          <div>지역📍 : {displayRegion}</div>
          <div>인원 : {displayPerson}</div>
          <div>대여 장비 목록 : {displayRentalEquipment}</div>
          <div>요청사항 : {displayOcontent}</div>
          <div>시간📆 : {displayDate} {displayTime}</div>
        </div>
        <div className="text-red-500 font-semibold mt-2">
          마감 임박! {timeMap[ono]} 남았어요!
        </div>
      </div>

      {/* 견적 제안 리스트 */}
      <div className="mb-4">
        <div className="text-sm text-gray-700 mb-2">견적 제안</div>
        <div className="grid grid-cols-2 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`border rounded p-3 cursor-pointer transition ${
                selectedCompanyId === company.id ? "border-blue-500 border-2 shadow-md" : ""
              }`}
              onClick={() => setSelectedCompanyId(company.id)}
            >
              <div className="text-sm font-semibold">
                {company.name} | {company.location} | 리뷰 {company.reviewCount}건
              </div>
              <div className="text-sm mt-1 truncate">{company.description}</div>
              <div className="font-semibold mt-2">제시가 {company.price}원~</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleModifyClick}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          견적 요청 수정
        </button>
        <button
          onClick={handleDeleteClick}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          견적 요청 삭제
        </button>
        <button
          onClick={handleConfirmClick}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          선택된 업체 확정
        </button>
      </div>
    </div>
  );
};

export default BContentP11;