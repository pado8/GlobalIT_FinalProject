import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import { putSellerUpdate, getSellerModifyInfo, getSellerRegistered } from "../../api/SellerApi";
import { uploadImage, getImageUrl } from "../../api/UploadImageApi";
import "../../css/SellerModifyPage.css";

const SellerModifyPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const introInputRef = useRef();
  const { user, loading } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({ main: null, intros: [] });
  const [slideIndex, setSlideIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    simage: [],
    introContent: "",
    info: ""
  });
  const [basicInfo, setBasicInfo] = useState({
    sname: "",
    phone: "",
    slocation: ""
  });

  useEffect(() => {
    if (loading) return;
    const init = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      if (user.role !== "SELLER") {
        navigate("/error");
        return;
      }
      const registered = await getSellerRegistered();
      if (!registered) {
        alert("아직 업체 등록을 하지 않았습니다. 먼저 등록을 진행해주세요.");
        navigate("/sellerlist/register");
        return;
      }
      setIsRegistered(true);
      const info = await getSellerModifyInfo();
      setBasicInfo({
        sname: info.sname || "",
        phone: info.phone || "",
        slocation: info.slocation || ""
      });
      setFormData({
        simage: info.simage || [],
        introContent: info.introContent || "",
        info: info.info || ""
      });
      const urls = (info.simage || []).map(getImageUrl);
      setPreviewUrls({ main: urls[0] || null, intros: urls.slice(1) });
    };
    init();
  }, [user, loading, navigate]);

  if (loading || !user || !isRegistered) return null;

  const handleMainChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      alert("유효한 이미지 파일을 선택해주세요 (10MB 이하)");
      fileInputRef.current.value = null;
      return;
    }
    const uploaded = await uploadImage([file]);
    const path = uploaded[0].path;
    setFormData(prev => ({ ...prev, simage: [path, ...prev.simage.slice(1)] }));
    setPreviewUrls(prev => ({ ...prev, main: getImageUrl(path) }));
  };

  const handleIntroChange = async (e) => {
    const files = Array.from(e.target.files);
    const invalid = files.find(f => !f.type.startsWith("image/") || f.size > 10 * 1024 * 1024);
    if (invalid) {
      alert("10MB 이하 이미지 파일만 업로드 가능합니다.");
      introInputRef.current.value = null;
      return;
    }
    const uploaded = await uploadImage(files);
    const paths = uploaded.map(u => u.path);
    const urls = uploaded.map(u => u.url);
    setFormData(prev => ({
      ...prev,
      simage: [prev.simage[0], ...prev.simage.slice(1), ...paths]
    }));
    setPreviewUrls(prev => ({ ...prev, intros: [...prev.intros, ...urls] }));
  };

  const handleIntroRemove = (index) => {
    const updatedIntros = [...previewUrls.intros];
    const updatedPaths = [...formData.simage.slice(1)];
    updatedIntros.splice(index, 1);
    updatedPaths.splice(index, 1);
    setPreviewUrls(prev => ({ ...prev, intros: updatedIntros }));
    setFormData(prev => ({ ...prev, simage: [prev.simage[0], ...updatedPaths] }));
  };

  const handleMainCancel = () => {
    setFormData(prev => ({ ...prev, simage: [] }));
    setPreviewUrls(prev => ({ ...prev, main: null }));
    fileInputRef.current.value = null;
  };

  const handleIntroCancel = () => {
    setFormData(prev => ({ ...prev, simage: [prev.simage[0]] }));
    setPreviewUrls(prev => ({ ...prev, intros: [] }));
    introInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const { sname, phone, slocation } = basicInfo;
    let { simage, info, introContent } = formData;
    if (!sname || !phone || !slocation || !info || !introContent) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    if (!simage.length || !simage[0]) {
      simage = ["default/default.png", ...simage.slice(1)];
    }
    setSubmitting(true);
    try {
      await putSellerUpdate({ simage, info, introContent, sname, phone, slocation });
      alert("업체 정보가 수정되었습니다.");
      navigate("/sellerlist");
    } catch (e) {
      console.error(e);
      alert("수정 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="main-simage" onClick={() => !previewUrls.main && fileInputRef.current.click()}>
        <img
          src={previewUrls.main || getImageUrl("default/default.png")}
          alt="대표 이미지"
          onClick={(e) => {
            e.stopPropagation();
            if (previewUrls.main) {
              setEnlargedImage(previewUrls.main);
            } else {
              fileInputRef.current.click();
            }
          }}
        />
      </div>

      <input type="file" hidden ref={fileInputRef} onChange={handleMainChange} accept="image/*" />

      <div className="button-group">
        {!previewUrls.main ? (
          <button className="button-blue" onClick={() => fileInputRef.current.click()}>대표 이미지 설정</button>
        ) : (
          <button className="button-red" onClick={handleMainCancel}>취소</button>
        )}
      </div>

      <div className="basic-info-form">
  <div>
    <label htmlFor="sname">업체 이름</label>
    <input
      id="sname"
      type="text"
      value={basicInfo.sname}
      onChange={(e) => setBasicInfo(prev => ({ ...prev, sname: e.target.value }))}
    />
  </div>

  <div>
    <label htmlFor="phone">연락처</label>
    <input
      id="phone"
      type="text"
      value={basicInfo.phone}
      readOnly
      tabIndex={-1}
    />
  </div>

  <div>
    <label htmlFor="slocation">업체 주소</label>
    <input
      id="slocation"
      type="text"
      value={basicInfo.slocation}
      onChange={(e) => setBasicInfo(prev => ({ ...prev, slocation: e.target.value }))}
    />
  </div>
</div>

      {previewUrls.intros.length > 0 && (
        <div className="slider-wrapper">
          {previewUrls.intros.length > 3 && (
            <button
              onClick={() => setSlideIndex(prev => Math.max(prev - 3, 0))}
              className={`slider-button left ${slideIndex === 0 ? "disabled" : ""}`}
              disabled={slideIndex === 0}
            >
              &lt;
            </button>
          )}
          <div className="slider">
            {previewUrls.intros.slice(slideIndex, slideIndex + 3).map((src, idx) => {
              const globalIndex = slideIndex + idx;
              return (
                <div className="slider-img-wrapper" key={`${src}-${globalIndex}`}>
                  <img src={src} alt={`소개 ${globalIndex}`} onClick={() => setEnlargedImage(src)} />
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIntroRemove(globalIndex);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          {previewUrls.intros.length > 3 && (
            <button
              onClick={() => setSlideIndex(prev => prev + 3)}
              className={`slider-button right ${slideIndex + 3 >= previewUrls.intros.length ? "disabled" : ""}`}
              disabled={slideIndex + 3 >= previewUrls.intros.length}
            >
              &gt;
            </button>
          )}
        </div>
      )}

      <div className="button-group">
        <button className="button-blue" onClick={() => introInputRef.current.click()}>
          {previewUrls.intros.length === 0 ? '소개 이미지 설정' : '소개 이미지 추가'}
        </button>
        {previewUrls.intros.length > 0 && (
          <button className="button-red" onClick={handleIntroCancel}>취소</button>
        )}
      </div>

      <input type="file" hidden ref={introInputRef} onChange={handleIntroChange} multiple accept="image/*" />

      <h2 className="info-title">업체 정보</h2>
      <input
        name="info"
        className="input-field"
        placeholder="업체 정보를 작성해주세요!"
        value={formData.info}
        onChange={e => setFormData(prev => ({ ...prev, info: e.target.value }))}
      />
      <h2 className="content-title">업체 소개</h2>
      <textarea
        name="introContent"
        className="textarea"
        placeholder="업체소개 글을 작성해주세요!"
        value={formData.introContent}
        onChange={e => setFormData(prev => ({ ...prev, introContent: e.target.value }))}
      />
      <button className="register-button" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "수정 중..." : "수정 완료"}
      </button>

      {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="확대 이미지" />
        </div>
      )}
    </div>
  );
};

export default SellerModifyPage;
