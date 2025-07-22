import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { deleteBiz,checkBizModifiable,checkDeletedBid } from "../../api/BizApi";
import { deleteOrder, confirmCompanySelection } from "../../api/orderApi";
import { FaArrowLeft, FaRunning, FaMapMarkerAlt, FaUsers, FaClipboardList, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';



// 견적 상세보기
const BContentP11 = ({ quote, companies, isOwner, isSeller, hasSellerBid, onCompanyInfoClick,  onBidDeleted, }) => {
  const navigate = useNavigate();
  const { ono } = useParams(); // URL 파라미터 (견적 ID)
  const { user } = useAuth(); 
  
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

// null 대비 매핑
  const displayOtitle = quote.otitle ? quote.otitle : '제목 null';
  const displayDate = 
    quote.rentalDate ? new Date(quote.rentalDate).toLocaleDateString('ko-KR') : '날짜 null';
  const displayTime = quote.rentalTime ? quote.rentalTime : '시간 null';
  const displayPerson = quote.person ? `${quote.person}명` : '인원 null';
  const displayRegion = quote.region ? `${quote.region}` : '지역 null';
  let rentalEquipmentStr;
  if(quote.rentalEquipment){
    rentalEquipmentStr = quote.rentalEquipment.replaceAll("&", " ").replaceAll(",", ", ").replaceAll("기타","");
  }
  const displayRentalEquipment = rentalEquipmentStr ? rentalEquipmentStr : '대여 장비 미신청';
  // const displayRentalEquipment = quote.rentalEquipment ? `${quote.rentalEquipment}` : '대여 장비 미신청';
  
  const displayOcontent = quote.ocontent ? `${quote.ocontent}` : '요청사항이 없어요';

  const handleModifyClick = () => {
    if (quote.isUrgent) {
      alert("남은 시간이 12시간 이하인 견적 요청은 수정할 수 없습니다.");
      return;
    }
    navigate(`/request/modify/${ono}`);
  };
  const handleDeleteClick = () => {
    deleteOrder(ono)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
    navigate(`/request/list`);
  };

    const handleCompanyCardClick = (company) => {
    // 현재 클릭된 업체의 ID (company.id)가 이미 선택된 상태인지 확인
    if (selectedCompanyId === company.seller.mno) {
      // 이미 선택된 업체라면, 선택 해제
      setSelectedCompanyId(null);
    } else {
      // 선택되지 않은 업체라면, 해당 업체 선택
      setSelectedCompanyId(company.seller.mno);
    }
  };

  const handleConfirmClick = async () => {
    if (!selectedCompanyId) {
      alert("마음에 드는 업체의 견적을 선택해주세요.");
      return;
  }
    
    try {
      await confirmCompanySelection(ono, selectedCompanyId);
      // alert("업체가 확정되었습니다!");
      navigate(`/request/list`);
    } catch (error) {
      console.error("업체 확정 오류 :", error);
      const errorMessage = error.response?.data?.message || "업체 확정에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    }
  };
  
  const handleCompanyInfoClick = (e, company) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트(업체 선택) 전파를 막습니다.
    onCompanyInfoClick(company); // 부모로부터 받은 모달 열기 함수를 호출합니다.
  };
  

  return (
    <div className='request-body bg-cover bg-center'>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6
         bcontent-container">
        {/* 견적 제목 및 요약 (상대 위치 지정) */}
        <div className="relative mb-4 border-b pb-4 bcontent-summary">
          {/* 뒤로가기 버튼 (절대 위치 지정) */}
          <button
            onClick={() => navigate(-1)}
            className="rq-undo-btn"
            aria-label="뒤로가기"
          >
            <FaArrowLeft size={20} />
          </button>
          <div className="text-sm text-gray-600">현재 견적</div>
          <p>
            {(() => {
              if (quote.finished === 11) {
                return <span style={{ color: 'green', fontWeight: 'bold' }}>확정을 완료했어요</span>;
              }
              if (quote.finished === 1) {
                return <span style={{ color: 'red', fontWeight: 'bold' }}>마감되었어요</span>;
              }
              if (quote.isUrgent) {
                return (
                  <span style={{ color: '#DC2626', fontWeight: 'bold' }}>
                    마감 임박! {quote.timeLeftStr} 남았어요!
                  </span>
                );
              }
              return <span>진행중이에요 : {quote.timeLeftStr}</span>;
            })()}
          </p>
          <div className="font-bold text-lg mt-1">{displayOtitle}</div>
          <div className="text-sm text-gray-500">작성자: {quote.writerNickname || '정보 없음'}</div>
          {/* 견적 요약 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
            <div className="flex items-center"><FaRunning className="mr-2 text-gray-500" /><span><strong>종목:</strong> {quote.playType}</span></div>
            <div className="flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /><span><strong>지역:</strong> {displayRegion}</span></div>
            <div className="flex items-center"><FaUsers className="mr-2 text-gray-500" /><span><strong>인원:</strong> {displayPerson}</span></div>
            <div className="flex items-center"><FaCalendarAlt className="mr-2 text-gray-500" /><span><strong>시간:</strong> {displayDate} {displayTime}</span></div>
            <div className="sm:col-span-2 flex items-start"><FaClipboardList className="mr-2 mt-1 flex-shrink-0 text-gray-500" /><span><strong>대여 장비 목록:</strong> {displayRentalEquipment}</span></div>
            <div className="sm:col-span-2 flex items-start"><FaLightbulb className="mr-2 mt-1 flex-shrink-0 text-gray-500" /><span><strong>요청사항:</strong> {displayOcontent}</span></div>
          </div>
        </div>

        {/* 견적 제안 리스트 */}
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">견적 제안</div>
          <div className="grid grid-cols-2 gap-4   company-grid">
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <div
                  key={company.seller.mno}
                  className={`border rounded p-3 cursor-pointer transition company-card ${
                    selectedCompanyId === company.seller.mno
                      ? "border-blue-500 border-2 shadow-md selected"
                      : ""
                  }`}
                  onClick={() => handleCompanyCardClick(company)}
                >
                  <div
                    className="company-info text-sm font-semibold"
                    onClick={(e) => handleCompanyInfoClick(e, company)}
                  >
                    <span className="company-name">{company.seller.sname}</span>
                    <div className="company-details">
                      <span className="company-location">{company.seller.slocation}</span>
                      <span className="company-review">리뷰 {company.seller.hiredCount ?? '-'}건</span>
                    </div>
                    <hr/>
                  </div>
                  <div className="text-sm mt-1 truncate">{company.biz.bcontent}</div>
                  <div className="text-sm mt-1 truncate">{company.biz.banswer}</div>
                  <div className="font-semibold mt-2 truncate">
                    {company.biz.price && company.biz.price > 0
                      ? `제시가 ${company.biz.price.toLocaleString('ko-KR')}원~`
                      : '가격 협의'}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                아직 제시한 업체가 없습니다.
              </div>
            )}
          </div>
        </div>


        {/* 하단 버튼 */}
        {isOwner && quote.finished !== 11 && (
          <div className="flex justify-between mt-6 rq-button-group">
            {/* 진행 중인 견적(finished가 0 또는 false)일 때만 수정 버튼 표시 */}
            {!quote.finished && (
              <button onClick={handleModifyClick} className="md-button">
                수정
              </button>
            )}
              <button onClick={handleDeleteClick} className="md-button">
                취소
              </button>
              <button onClick={handleConfirmClick} className="confirm-button">
                선택 업체 확정
              </button>
          </div>
        )}
        

        {!isOwner && isSeller && quote.finished !== 11 && (
  hasSellerBid ? (
    selectedCompanyId === user?.mno ? (
      <div className="flex justify-between mt-6 rq-button-group">
        <button
          className="md-button"
          onClick={async () => {
            try {
              await checkBizModifiable(ono);
              navigate(`/request/${ono}/bizmodify`);
            } catch (err) {
              const msg = err?.response?.data || "입찰 수정이 불가합니다.";
              alert(msg);
            }
          }}
        >
          수정
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 confirm-button"
          onClick={async () => {
            const confirmed = window.confirm("정말로 입찰을 포기하시겠습니까?\n삭제 후에는 복구할 수 없습니다.");
            if (!confirmed) return;

            try {
              await deleteBiz(ono);
              alert("입찰이 포기되었습니다.");
              onBidDeleted(user?.mno);
            } catch (err) {
              const msg = err?.response?.data || "입찰 삭제 중 오류가 발생했습니다.";
              alert(msg);
            }
          }}
        >
          포기
        </button>
      </div>
    ) : null
  ) : (
    <div className="mt-6 rq-button-group">
      <button
        onClick={async (e) => {
          e.preventDefault();
          try {
            const deleted = await checkDeletedBid(ono);
            if (deleted) {
              alert("이전에 입찰을 포기하셨기 때문에 재입찰할 수 없습니다.");
              return;
            }
            navigate(`/request/${ono}/bizregister`);
          } catch (err) {
            console.error(err);
            alert("입찰 가능 여부 확인 중 오류가 발생했습니다.");
          }
        }}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 confirm-button block text-center"
      >
        입찰하기
      </button>
    </div>
  )
)}
      </div>
    </div>
  );
};

export default BContentP11;