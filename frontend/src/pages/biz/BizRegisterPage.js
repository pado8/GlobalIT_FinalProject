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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bizData = {
      mno,
      ono,
      price: parseInt(price, 10),
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
        <h2><span className="highlight">견적 SELECT!</span></h2>
        <h1>견적 제안</h1>
        <p>원하는 견적을 제안해보세요!</p>
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
          <h4>견적 제안</h4>
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
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="숫자만 입력"
          />

          <button type="submit" className="submit-btn">제안 등록</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default BizRegisterPage;
