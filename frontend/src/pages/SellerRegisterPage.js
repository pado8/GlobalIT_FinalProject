// SellerRegisterPage.js (이미지 업로드 + 최종 등록까지 포함)

import { useRef, useState } from "react";
import axios from "axios";
import { API_SERVER_HOST } from "../api/common";
import "../css/SellerRegisterPage.css";

const uploadUrl = `${API_SERVER_HOST}/api/uploadAjax`;
const registerUrl = `${API_SERVER_HOST}/api/seller/register`;

const SellerRegisterPage = ({ mno }) => {
  const [formData, setFormData] = useState({
    simage: [], // [0] = 대표이미지, 이후 = 소개이미지
    introContent: "",
    info: ""
  });
  const [introPreviews, setIntroPreviews] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fileInputRef = useRef();
  const introInputRef = useRef();

  const handleUpload = async (files, isMain = false) => {
    const uploadForm = new FormData();
    for (let file of files) uploadForm.append("files", file);

    try {
      const res = await axios.post(uploadUrl, uploadForm);
      const paths = res.data.map((dto) => `${dto.folderPath}/${dto.uuid}_${dto.fileName}`);

      setFormData((prev) => {
        if (isMain) return { ...prev, simage: [paths[0], ...prev.simage.slice(1)] };
        return { ...prev, simage: [...prev.simage, ...paths] };
      });

      if (!isMain) {
        const previewUrls = Array.from(files).map((file) => URL.createObjectURL(file));
        setIntroPreviews((prev) => [...prev, ...previewUrls]);
      }
    } catch (err) {
      alert("업로드 실패");
    }
  };

  const handleMainChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload([file], true);
  };

  const handleIntroChange = (e) => {
    handleUpload(Array.from(e.target.files), false);
  };

  const handleSubmit = async () => {
    try {
      const { simage, info, introContent } = formData;
      await axios.post(`${registerUrl}/${mno}`, {
        simage,
        info,
        introContent
      });
      alert("등록 완료");
    } catch (e) {
      alert("등록 실패");
    }
  };

  return (
    <div className="container">
      <div className="main-simage" onClick={() => fileInputRef.current.click()}>
        {formData.simage[0] ? (
          <img
            src={`${API_SERVER_HOST}/display?file=${formData.simage[0]}`}
            alt="대표"
            onClick={(e) => {
              e.stopPropagation();
              setEnlargedImage(`${API_SERVER_HOST}/display?file=${formData.simage[0]}`);
            }}
          />
        ) : (
          <div className="img-placeholder">대표 이미지 설정</div>
        )}
      </div>
      <input type="file" hidden ref={fileInputRef} onChange={handleMainChange} accept="image/*" />

      <div className="slider">
        {introPreviews.slice(slideIndex, slideIndex + 3).map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`소개 ${idx}`}
            onClick={() => setEnlargedImage(src)}
          />
        ))}
        {slideIndex > 0 && <button onClick={() => setSlideIndex(slideIndex - 3)}>&lt;</button>}
        {slideIndex + 3 < introPreviews.length && (
          <button onClick={() => setSlideIndex(slideIndex + 3)}>&gt;</button>
        )}
      </div>
      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />
      <button onClick={() => introInputRef.current.click()}>소개 이미지 추가</button>

      <input
        type="text"
        placeholder="업체 정보"
        value={formData.info}
        onChange={(e) => setFormData((prev) => ({ ...prev, info: e.target.value }))}
      />
      <textarea
        placeholder="업체 소개"
        value={formData.introContent}
        onChange={(e) => setFormData((prev) => ({ ...prev, introContent: e.target.value }))}
      />

      <button onClick={handleSubmit}>등록</button>

      {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerRegisterPage;
