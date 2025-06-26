import React, { useEffect, useState } from "react";

const GmoApiComp = () => {
  const [sidoList, setSidoList] = useState([]);
  const [selectedSido, setSelectedSido] = useState("");
  const [sigunguList, setSigunguList] = useState([]);

  useEffect(() => {
    fetch("/api/vworld/sido")
      .then(res => res.json())
      .then(json => {
        const list = json.response.result.featureCollection.features.map(f => ({
          code: f.properties.ctprvn_cd,
          name: f.properties.ctp_kor_nm
        }));
        setSidoList(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSido) return;
    console.log("선택된 시도 이름:", selectedSido);
    fetch(`/api/vworld/sigungu?sidoName=${encodeURIComponent(selectedSido)}`)
      .then(res => res.json())
      .then(json => {
        if (
          json?.response?.status === "OK" &&
          json?.response?.result?.featureCollection?.features
        ) {
          const list = json.response.result.featureCollection.features.map(f => ({
            code: f.properties.sig_cd,
            name: f.properties.sig_kor_nm
          }));
          setSigunguList(list);
        } else {
          console.warn("시군구 데이터 없음 또는 응답 실패", json);
          setSigunguList([]);
        }
      })
      .catch(err => {
        console.error("시군구 API 요청 실패:", err);
        setSigunguList([]);
      });
  }, [selectedSido]);

  
  const handleCheckSidoNames = () => {
    fetch("/api/vworld/allSigungu")
      .then((res) => res.json())
      .then((json) => {
        if (
          json?.response?.result?.featureCollection?.features &&
          Array.isArray(json.response.result.featureCollection.features)
        ) {
          const list = json.response.result.featureCollection.features.map(
            (f) => f.properties.sig_kor_nm
          );
          console.log("정확한 시도 이름 목록:", list);
        } else {
          console.warn("시도 이름 응답 형식이 예상과 다릅니다:", json);
        }
      })
      .catch((err) => {
        console.error("시도 이름 확인 실패:", err);
      });
  };


  return (
    <div className="flex gap-4">
      <select onChange={e => setSelectedSido(e.target.value)}>
        <option value="">시/도 선택</option>
        {sidoList.map(s => (
          <option key={s.code} value={s.name}>{s.name}</option>
        ))}
      </select>

      <select disabled={!sigunguList.length}>
        <option value="">시/군/구 선택</option>
        {sigunguList.map(s => (
          <option key={s.code} value={s.name}>{s.name}</option>
        ))}
      </select>
      <button
        onClick={handleCheckSidoNames}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        데이터 확인하기
      </button>
    </div>
  );
};

export default GmoApiComp;