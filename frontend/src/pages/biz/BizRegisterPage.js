import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { registerBiz } from "../../api/BizApi";
import titleImage from "../../assets/img/title.png";
import "../../css/BizRegisterPage.css";

const BizRegisterPage = ({ mno }) => {
  const { ono } = useParams(); // 견적 요청 ID
  const [bcontent, setBcontent] = useState("");
  const [banswer, setBanswer] = useState("");
  const [price, setPrice] = useState("");

  // 쉼표 제거 → 숫자만 추출
  const formatToNumber = (value) => {
    const num = value.replace(/[^0-9]/g, "");
    return num;
  };

  // 숫자 → 쉼표 포맷
  const formatWithComma = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e) => {
    const raw = formatToNumber(e.target.value); // 숫자만 추출
    setPrice(formatWithComma(raw));             // 쉼표 붙여서 표시
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const bizData = {
    mno,
    ono,
    price: parseInt(price.replace(/,/g, ""), 10),
    bcontent,
    banswer,
  };

    try {
      await registerBiz(bizData);
      alert("입찰 제안이 완료되었습니다!");
      setBcontent("");
      setBanswer("");
      setPrice("");
    } catch (err) {
      console.error("입찰 등록 실패:", err);
      alert("입찰 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="biz-register-page">
      <div
          className="biz-title-bg"
          style={{ backgroundImage: `url(${titleImage})` }}
        ></div>

      <div className="biz-title-overlay">
      <div className="biz-title-container">
      <h1>입찰 제안 등록</h1>
      <p>고객 요청에 맞춰 나만의 제안을 입력해보세요.</p>
    </div>

      <div className="biz-content-wrapper">
        {/* 왼쪽 박스 (견적 요청 정보) */}
        <div className="request-box">
          <h4>요청 정보</h4>
          <p>📍 지역: 서울 강남구</p>
          <p>⚽ 종목: 축구</p>
          <p>🧢 장비: 유니폼, 축구화</p>
          <p>⏰ 대여일: 2025-07-10</p>
          <p>👥 인원: 11명</p>
        </div>

        {/* 오른쪽 박스 (입력 폼) */}
        <form onSubmit={handleSubmit} className="biz-form-box">
          <h4>입찰 제안</h4>
          <label>상세정보</label>
          <textarea
            value={bcontent}
            onChange={(e) => setBcontent(e.target.value)}
            rows={4}
            required
          />

          <label>요청 답변</label>
          <textarea
            value={banswer}
            onChange={(e) => setBanswer(e.target.value)}
            rows={3}
            required
          />

          <label>제안 가격</label>
          <div className="price-input-wrapper">
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              placeholder="숫자만 입력"
              required
            />
            <span className="price-unit">원</span>
          </div>

          <button type="submit" className="submit-btn">제안 등록</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default BizRegisterPage;
