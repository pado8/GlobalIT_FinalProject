import { Link,Outlet } from 'react-router-dom';
import OrderList from "../../components/requestComponents/bContentP10";
import Hero from "../../components/requestComponents/bHero";

// 10-견적목록(마이페이지)

const { Active, List } = OrderList;

const OrderMyPage = () => {
  const activeList = {
    title: "[장소+장비] 축구 종합 대여 요청",
    location: "서울특별시 관악구/금천구/동작구/서초구",
    date: "2025/07/09",
    isUrgent: true,
    timeLeft: "3:11:07"
  };

  const closedOrder = [
    { title: "[장소] 풋살 장소 대여 요청" },
    { title: "[장비] 축구 장비 대여 요청" }
  ];

  const cancelledOrder = [
    { title: "[장비] 풋볼 장비 대여 요청" }
  ];

  const myPageHero = {
    mainTitle: "나의 견적",
    subTitle: "지금 KICK!",
    notion: "이번에는 어디서 할까?"
  };

  const pno = 12345;

  return (
    <div>
      {/* <Header /> */}
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <Hero {...myPageHero} />

        <Active {...activeList} />
        <List title="마감된 견적" quotes={closedOrder} type="closed" />
        <List title="취소된 견적" quotes={cancelledOrder} type="cancelled" />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default OrderMyPage;
