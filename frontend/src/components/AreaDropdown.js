import { useState } from "react";
import "../css/AreaDropdown.css";

const AreaDropdown = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("지역");

  const seoulDistricts = [
    "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구"
  ];

  const handleRegionClick = () => {
    setStep(2);
  };

  const handleSelect = (region) => {
    setSelectedRegion(region);
    setOpen(false);
    setStep(1);
  };

  return (
    <div className="area-dropdown-wrapper">
      <button className="area-dropdown-button" onClick={() => setOpen(true)}>
        {selectedRegion} <span className="arrow">▾</span>
      </button>

      {open && (
        <div className="area-dropdown-overlay" onClick={() => setOpen(false)}>
          <div className="area-dropdown-panel" onClick={(e) => e.stopPropagation()}>
            <div className="area-dropdown-header">
              <span>{step === 1 ? "지역 선택" : "서울 구 선택"}</span>
              <button className="area-dropdown-close" onClick={() => setOpen(false)}>×</button>
            </div>

            {step === 1 && (
              <ul className="area-dropdown-list">
                <li onClick={() => handleSelect("전국")}>전국</li>
                <li onClick={handleRegionClick}>서울</li>
              </ul>
            )}

            {step === 2 && (
              <ul className="area-dropdown-list">
                <li onClick={() => handleSelect("서울 전체")}>서울 전체</li>
                {seoulDistricts.map((gu) => (
                  <li key={gu} onClick={() => handleSelect(gu)}>
                    {gu}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaDropdown;
