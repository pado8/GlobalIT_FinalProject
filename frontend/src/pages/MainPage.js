// src/pages/MainPage.js
import { useEffect, useState } from "react";
import Slider from "react-slick";
// import { getOrderList } from "../api/orderApi";
import { getList as getCommunityList } from "../api/communityApi";
import { getSellerList } from "../api/SellerApi";
import { getImageUrl } from "../api/UploadImageApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/MainPage.css";
import { useNavigate } from "react-router-dom";

// public/images 폴더에 배너 이미지를 넣고 경로를 적어주세요
const bannerImages = [
  "img/banner1.png",
  "img/banner2.png",
  "img/banner3.png",
  "img/banner4.png",
  "img/banner5.png",
];

const MainPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [community, setCommunity] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    // getOrderList({ page: 1, size: 10 }).then(res => setOrders(res.dtoList)).catch(console.error);
    getCommunityList({ page: 1, size: 5 })
      .then(res => setCommunity(res.dtoList))
      .catch(console.error);

    getSellerList(1, 8)
      .then(res => setSellers(res.dtoList))
      .catch(console.error);
  }, []);

  const bannerSettings = {
    dots: true,
    infinite: true,
    // autoplay: true,
    // autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const multiSlideSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  const getSafeImage = (simage) => {
    if (!Array.isArray(simage)) return "default/default.png";
    const first = simage[0]?.trim();
    return first && first !== "undefined" ? first : "default/default.png";
  };

  return (
    <div id="mainPage">
      {/* 배너 섹션 */}
      <section className="banner_section">
        <Slider {...bannerSettings}>
          {bannerImages.map((src, idx) => (
            <div key={idx} className="banner_item">
              <img src={src} alt={`배너-${idx + 1}`} />
            </div>
          ))}
        </Slider>
      </section>

      {/* 최근 견적 요청 섹션 */}
      <section className="orderlist_section">
        <h2>최근 견적 요청</h2>
        <Slider {...multiSlideSettings}>
          {orders.map(order => (
            <div key={order.id} className="order_item item" onClick={() => navigate(`/order/detail/${order.id}`)}>
              <h3>{order.title}</h3>
              <p>{order.summary}</p>
              <span>{order.date}</span>
            </div>
          ))}
        </Slider>
      </section>

      {/* 커뮤니티 최신글 섹션 */}
      <section className="community_section">
        <h2>커뮤니티 최신글</h2>
        <ul className="community_list">
          {community.map(post => (
            <li key={post.pno} className="community_item item" onClick={() => navigate(`/community/read/${post.pno}`)}>
              <a href={`/community/read/${post.pno}`}>{post.ptitle}</a>
              <span>{post.writerName}</span>
              <span>{new Date(post.pregdate).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 판매자 목록 섹션 */}
      <section className="sellerlist_section">
        <h2>추천 업체</h2>
        <Slider {...multiSlideSettings}>
          {sellers.map((seller) => {
            const thumb = getSafeImage(seller.simage);
            return (
              <div key={seller.mno} className="seller_item item">
                <img
                  src={getImageUrl(thumb)}
                  alt={seller.sname}
                  className="seller_thumb"
                />
                <h3 className="seller_name">{seller.sname}</h3>
                <div>선정 횟수: {seller.hiredCount}</div>
                <div>{seller.slocation || "주소 없음"}</div>
              </div>
            );
          })}
        </Slider>
      </section>
    </div>
  );
};

export default MainPage;
