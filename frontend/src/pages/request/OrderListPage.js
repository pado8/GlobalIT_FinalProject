import { useEffect, useState } from "react";
import { getOrderList } from "../../api/RequestApi";
import { useSearchParams } from "react-router-dom";
import { FaRunning,FaMapMarkerAlt,FaRegCalendarAlt } from "react-icons/fa";
import titleImage from "../../assets/img/title.png";
import AreaDropdown from "../../components/AreaDropdown";
import Pagination from "../../components/paging/Pagination";
import "../../css/OrderListPage.css";

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArea, setSelectedArea] = useState({ city: null, district: null });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);

useEffect(() => {
  setSearchParams({
    page: currentPage,
    city: selectedCity || "",       // 선택된 시/도
    district: selectedDistrict || "" // 선택된 구/군
  });
}, [currentPage, selectedCity, selectedDistrict]);  

useEffect(() => {
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const cityFromUrl = searchParams.get("city") || "";
  const districtFromUrl = searchParams.get("district") || "";

  setCurrentPage(pageFromUrl);
  setSelectedCity(cityFromUrl);
  setSelectedDistrict(districtFromUrl);
  setSelectedArea({ city: cityFromUrl, district: districtFromUrl });
  setInitialized(true);
}, [searchParams]);


useEffect(() => {
  if (!initialized) return;
  getOrderList(currentPage, 5, selectedArea.city, selectedArea.district)
    .then(data => {
      setOrders(data.dtoList);
      setPageData(data);
    })
    .catch(err => console.error("주문 목록 로딩 실패", err));
}, [currentPage, selectedArea]);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

  return (
    <div className="order-title-container">
      
  <div
    className="order-title-bg"
    style={{ backgroundImage: `url(${titleImage})` }}
  ></div>

    <div className="order-title-overlay">
      <h2 className="order-title-overlay-main">견적 SELECT!</h2>
      <h3 className="order-title-overlay-sub">견적 목록</h3>
      <p className="order-title-overlay-desc">원하는 견적을 제안해보세요!</p>

      <div className="order-box">
        <div className="order-box-header">
          <span className="order-box-title">견적 목록</span>
                      <AreaDropdown
                        city={selectedCity}
                        district={selectedDistrict}
                        onChange={({ city, district }) => {
                          setSelectedArea({ city, district });
                          setSelectedCity(city);         
                          setSelectedDistrict(district);
                          setCurrentPage(1); // 필터 바뀌면 첫 페이지로
                        }}
                      />
        </div>

        <ul className="order-list">
          {orders.length === 0 ? (
            <li className="order-list-item empty">해당 지역의 견적이 없습니다.</li>
          ) : (
            orders.map((order) => (
              <li key={order.ono} className="order-list-item">
                <div className="order-card">
                  <div className="order-card-left">
                    <h4 className="order-title">{order.ocontent}</h4>
                    <p className="order-playtype"><FaRunning /> {order.playType}</p>
                    <p className="order-location"><FaMapMarkerAlt /> {order.olocation}</p>
                    <p className="order-date"><FaRegCalendarAlt /> {order.rentalDate?.slice(0, 10)}</p>
                  </div>
                  <div className="order-card-right">
                    <p className="order-regdate-label">작성일</p>
                    <p className="order-regdate">{order.oregdate?.slice(0, 10)}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>


        {pageData && (
      <Pagination
      current={pageData.currentPage}
      pageList={pageData.pageList}
      prev={pageData.prev}
      next={pageData.next}
      prevPage={pageData.prevPage}
      nextPage={pageData.nextPage}
      onPageChange={handlePageChange}
      className="order-pagination"
    />
  )}
</div>
</div>
</div>

  );
}

export default OrderListPage;
