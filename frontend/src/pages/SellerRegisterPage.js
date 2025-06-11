import { useRef, useState } from "react";
import "../css/SellerRegisterPage.css";

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    introContent: "",
    simage: "",
    info: "",
    introImages: [],
  });
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const fileInputRef = useRef(null);
  const introFileInputRef = useRef(null);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, simage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageCancel = () => {
    setFormData((prev) => ({ ...prev, simage: "" }));
    fileInputRef.current.value = null;
  };

  const handleIntroImageClick = () => {
    introFileInputRef.current.value = null;
    introFileInputRef.current.click();
  };

  const handleIntroImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64s) => {
      setFormData((prev) => {
        const updated = [...prev.introImages, ...base64s];
        const nextIndex = updated.length > 3 ? Math.floor((updated.length - 1) / 3) * 3 : 0;
        setSlideIndex(nextIndex);
        return { ...prev, introImages: updated };
      });
    });
  };

  const handleIntroImageDelete = (indexToDelete) => {
    setFormData((prev) => {
      const newImages = prev.introImages.filter((_, idx) => idx !== indexToDelete);
      const maxSlideIndex = Math.max(0, Math.floor((newImages.length - 1) / 3) * 3);
      const newSlideIndex = Math.min(slideIndex, maxSlideIndex);
      setSlideIndex(newSlideIndex);
      return { ...prev, introImages: newImages };
    });
  };

  const handlePrevSlide = () => {
    setSlideIndex((prev) => Math.max(prev - 3, 0));
  };

  const handleNextSlide = () => {
  const nextIndex = slideIndex + 3;
  if (nextIndex < formData.introImages.length) {
    setSlideIndex(nextIndex);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("전송될 데이터:", formData);
  };

  return (
    <div className="container">
      <div className="seller-register-wrapper">
        {/* 대표 이미지 */}
        <div className="main-simage" onClick={handleImageClick}>
          {formData.simage ? (
            <img
              src={formData.simage}
              alt="대표"
              className="preview-image"
              onClick={(e) => {
                e.stopPropagation();             // 클릭 버블 방지
                setEnlargedImage(formData.simage);
              }}
            />
          ) : (
            <div className="clickable-content">
              <div className="img-placeholder">🖼️</div>
              <div className="click-text">대표 이미지를 설정해주세요!</div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        {formData.simage && (
          <button className="btn cancel" onClick={handleImageCancel}>취소</button>
        )}

        <h2 className="title">업체이름</h2>
        <p className="subtitle_one">연락처</p>
        <p className="subtitle_two">업체주소</p>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={introFileInputRef}
          onChange={handleIntroImageChange}
          style={{ display: "none" }}
        />

        {/* 슬라이더 */}
        <div className="slider">
          {/* 왼쪽 화살표 */}
          {slideIndex > 0 && (
            <button onClick={handlePrevSlide} className="arrow-btn">
              &lt;
            </button>
          )}

          {formData.introImages
            .slice(slideIndex, slideIndex + 3)
            .map((img, idx) => {
              const actualIndex = slideIndex + idx;
              return (
                <div className="img-box" key={actualIndex}>
                  <img
                    src={img}
                    alt={`소개 ${actualIndex}`}
                    className="preview-image" 
                    onClick={() => setEnlargedImage(img)}
                  />
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIntroImageDelete(actualIndex);
                    }}
                  >
                    ❌
                  </button>
                </div>
              );
            })}

          {/* 오른쪽 화살표 */}
          {slideIndex + 3 < formData.introImages.length && (
            <button onClick={handleNextSlide} className="arrow-btn">
              &gt;
            </button>
          )}
        </div>

        <div className="image-section">
          <button className="btn blue" onClick={handleIntroImageClick}>
            업체소개 이미지를 설정해주세요!
          </button>
          <button className="btn cancel" onClick={() => {
            setFormData((prev) => ({ ...prev, introImages: [] }));
            setSlideIndex(0);
          }}>전체취소</button>
        </div>

        <input
          name="info"
          placeholder="업체정보를 작성해주세요!"
          value={formData.info}
          onChange={handleChange}
          className="input-field"
        />

        <textarea
          name="introContent"
          placeholder="업체소개 글을 작성해주세요!"
          value={formData.introContent}
          onChange={handleChange}
          className="textarea"
        />

              {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage} alt="확대된 이미지" />
            <button className="close-btn" onClick={() => setEnlargedImage(null)}>✖</button>
          </div>
        </div>
      )}

        <button className="btn register" onClick={handleSubmit}>등록</button>
      </div>
    </div>

    
  );
};

export default SellerRegisterPage;
