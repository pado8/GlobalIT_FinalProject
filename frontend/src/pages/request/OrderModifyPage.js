// 견적 수정 페이지
import OrderModifyForm from "../../components/requestComponents/bContentP09";
import Hero from "../../components/requestComponents/bHero";

const modifyHero = {
  mainTitle: "견적 수정하기",
  subTitle: "INTERVAL",
  notion: "바뀐 일정? 바로 반영 가능!"
};

const OrderModifyPage = () => {
  return (
    <div className="bg-cover bg-center min-h-screen pt-12">
      <Hero {...modifyHero} />
      <OrderModifyForm />
    </div>
  );
};

export default OrderModifyPage;
