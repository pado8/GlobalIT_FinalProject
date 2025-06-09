import { useState } from "react";
import "../css/SellerListPage.css";

const SellerListPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const Data = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 1,
    name: `업체이름 ${index + 1}`,
    address: `업체주소 ${index + 1}`,
    count: Math.floor(Math.random() * 100),
  }));

  return (
    <div id="wrap">
      <div className="header">
        <h2>업체정보</h2>
        <button className="register-btn">업체소개 등록</button>
      </div>

      <div className="card-container">
        {Data.map((item) => (
          <div className="card" key={item.id} onClick={openModal}>
            <div className="card-header">
              <div className="image">이미지</div>
              <div className="count">선정 횟수: {item.count}</div>
            </div>
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="address">{item.address}</div>
            </div>
            <button className="detail-btn">상세정보</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button>1</button>
      </div>

      {/* ✅ 모달 삽입 */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content"
          onClick={(e) =>e.stopPropagation()}>
            <div className="modal-header">
              <h3>상세정보</h3>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="seller-top">
                <div className="seller-image">이미지</div>
                <div className="seller-info">
                  <strong>업체이름</strong><br />
                  연락처<br />
                  업체주소<br />
                  선정횟수: 1
                </div>
              </div>

              <div className="image-slider">
                <button>{"<"}</button>
                <div className="img-box">이미지</div>
                <div className="img-box">이미지</div>
                <div className="img-box">이미지</div>
                <button>{">"}</button>
              </div>

              <div className="seller-detail">
                <p><strong>업체정보</strong> <br></br>스포츠 장비 대여</p>
                <p><strong>업체소개</strong><br />
                  10년 경력의 스포츠 장비 대여 전문 업체입니다.<br />
                  서울 전지역 당일 방문 가능!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListPage;