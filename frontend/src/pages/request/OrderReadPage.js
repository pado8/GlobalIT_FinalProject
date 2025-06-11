// pages/request/OrderReadPage.js
import BContentP11 from "../../components/requestComponents/bContentP11";
import Hero from "../../components/requestComponents/bHero";

const quoteDetail = {
  title: "[장소+장비] 축구 종합 대여 요청",
  location: "서울특별시 관악구/금천구/동작구/서초구",
  date: "2025/07/09",
  timeDesc: "시간협의가능",
  timeLeft: "3:11:07"
};

const companies = [
  { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "159,000" },
  { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "150,000" },
  { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "149,900" },
  { location: "업체지역", reviewCount: 0, description: "축구화 사이즈별로 10켤레 제공", price: "149,000" }
];

const heroContent = {
  mainTitle: "견적 상세",
  subTitle: "지금 KICK!",
  notion: "KICK AUCTION이 중개합니다"
};

const OrderReadPage = () => {
  return (
    <>
      <div className="bg-cover bg-center min-h-screen pt-12">
        <Hero {...heroContent} />
        <BContentP11 quote={quoteDetail} companies={companies} />
      </div>
    </>
  );
};

export default OrderReadPage;
