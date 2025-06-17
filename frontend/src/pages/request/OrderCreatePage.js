// 견적 신청
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import axios from 'axios'; // axios 임포트

import BContentP08 from "../../components/requestComponents/bContentP08";
import Hero from "../../components/requestComponents/bHero";

  const createHero = {
    mainTitle: "나의 견적",
    subTitle: "클릭하고 KICK-OFF",
    notion: "장소? 장비? 걱정없이!"
  };


const OrderCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sport: '',
    rental: '필요없어요', // 기본값 설정
    rentalItems: '',
    detail: '',
    region: '',
    datetime: null,
    timeDetail: "",
    people: '',
    request: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...formData };
      // '필요없어요'를 선택했을 경우 rentalItems와 detail을 비웁니다.
      if (formData.rental === '필요없어요') {
        dataToSend.rentalItems = '';
        dataToSend.detail = '';
      }
      delete dataToSend.rental; // 백엔드에 rental 필드를 보내지 않으므로 삭제

      const response = await axios.post('/api/orders', dataToSend);
      const newOno = response.data.ono; // 백엔드에서 생성된 ono를 반환한다고 가정

      alert("견적 요청이 성공적으로 생성되었습니다.");
      navigate(`/request/read/${newOno}`); // 생성 후 상세 페이지로 이동
    } catch (err) {
      alert("견적 생성에 실패했습니다.");
      console.error("Error creating order:", err);
    }
  };

  return (
    <>
      <div className="bg-cover bg-center min-h-screen pt-12">
        <Hero {...createHero} />
        <BContentP08
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default OrderCreatePage;
