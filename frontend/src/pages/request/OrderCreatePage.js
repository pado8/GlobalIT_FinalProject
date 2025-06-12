// 견적 신청
import bContentP08 from "../../components/requestComponents/bContentP08";
import Hero from "../../components/requestComponents/bHero";

  const createHero = {
    mainTitle: "나의 견적",
    subTitle: "클릭하고 KICK-OFF",
    notion: "장소? 장비? 걱정없이!"
  };


const OrderCreatePage = () => {
  console.log("OrderForm: ", bContentP08);
  console.log("Hero: ", Hero);
  return (
    <>
      {/* <Header /> */}
      <div
        className="bg-cover bg-center min-h-screen pt-12"
        // style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
      >
        <Hero {...createHero} />
        <bContentP08 />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default OrderCreatePage;
