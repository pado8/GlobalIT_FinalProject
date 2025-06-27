import { useState, useEffect } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { registerBiz,checkBizRegistered } from "../../api/BizApi";
import { getSellerRegistered } from "../../api/SellerApi";
import titleImage from "../../assets/img/title.png";
import "../../css/BizRegisterPage.css";

const BizRegisterPage = ({ ono }) => {
  // const { ono } = useParams(); // 견적 요청 ID
  const { user, loading } = useAuth();
  const [bcontent, setBcontent] = useState("");
  const [banswer, setBanswer] = useState("");
  const [price, setPrice] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isValid = bcontent.trim() && banswer.trim() && price.trim();

  useEffect(() => {
    if (loading) return;
    const check = async () => {
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      if (user.role !== "SELLER") {
        alert("업체 회원만 접근할 수 있습니다.");
        navigate("/error");
        return;
      }
      // phone 미등록 회원->마이페이지로
      if (user?.phone?.startsWith("t") && location.pathname.startsWith("/sellerlist/bizregister")) {
        alert("미인증 회원에게 제한된 컨텐츠입니다.\n전화번호 인증을 먼저 해야 합니다.");
        navigate("/updateinfosocial");
        return;
      }
      const registered = await getSellerRegistered();
      if (!registered) {
        alert("업체 소개 등록 후 이용 가능합니다.");
        navigate("/sellerlist/register");
        return;
      }

      const alreadyBid = await checkBizRegistered(ono); // 입찰 여부 확인
      if (alreadyBid) {
        alert("이미 입찰하셨습니다.");
        navigate("/orderlist");
        return;
      }

      setIsAllowed(true);
    };
    check();
  }, [user, loading, navigate]);

  if (loading || !isAllowed) return null; // 조건 만족 전엔 렌더링 안함

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

    const payload = {
      ono: parseInt(ono, 10),
      price: parseInt(price.replace(/,/g, ""), 10),
      bcontent,
      banswer
    };

    try {
      await registerBiz(payload); // 
      alert("입찰 제안이 등록되었습니다.");
      navigate("/orderlist");
    } catch (err) {
      alert("등록 실패");
      console.error(err);
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

            <button
            type="submit"
            className={`submit-btn ${!isValid ? 'disabled' : ''}`}
            disabled={!isValid}
            >
            입찰 등록
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default BizRegisterPage;
