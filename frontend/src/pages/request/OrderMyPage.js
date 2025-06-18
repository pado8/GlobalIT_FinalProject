
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios 임포트

import OrderList from "../../components/requestComponents/bContentP10";
import Hero from "../../components/requestComponents/bHero";

// 10-견적목록(마이페이지)

const { Active, List } = OrderList;

const OrderMyPage = () => {
  const [activeList, setActiveList] = useState(null); // 활성 견적 상태
  const [closedOrders, setClosedOrders] = useState([]); // 마감된 견적 상태
  const [cancelledOrders, setCancelledOrders] = useState([]); // 취소된 견적 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        //  API 호출 - GET /api/orders/my-orders
        const response = await axios.get('http://localhost:8080/api/orders/my-orders',{withCredentials: true});
        console.log("응답:", response.data);

        // 로그인 페이지 HTML을 받아온 경우 대비: content-type 검사
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("로그인하지 않았거나 응답 형식이 JSON이 아닙니다.");
        }
        const data = response.data;

        // 의도한 백엔드 응답 구조:
        // {
        //   activeOrder: { id, title, location, date, isUrgent, timeLeft },
        //   closedOrders: [ { id, title }, ... ],
        //   cancelledOrders: [ { id, title }, ... ]
        // }
        if (typeof data !== 'object' || (!data.activeOrder && !data.closedOrders && !data.cancelledOrders)) {
          throw new Error("잘못된 응답 구조");
        }

        const { activeOrder, closedOrders, cancelledOrders } = data;
        
        // 상태 업데이트
        setActiveList(activeOrder ?? null);
        setClosedOrders(closedOrders ?? []);
        setCancelledOrders(cancelledOrders ?? []);


      } catch (err) {
        setError("내 견적 목록을 불러오는 데 실패했습니다.");
        console.error("Error fetching my orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (loading) return <div className="text-center mt-20">로딩 중...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div>
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <Hero {...myPageHero} />

        {/* 활성 견적이 있을 경우에만 렌더링 */}
        {activeList && <Active {...activeList} />}
        <List title="마감된 견적" quotes={closedOrders} type="closed" />
        <List title="취소된 견적" quotes={cancelledOrders} type="cancelled" />
      </main>
    </div>
  );
};

export default OrderMyPage;
