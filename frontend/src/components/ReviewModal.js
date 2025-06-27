// src/components/ReviewModal.js
import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../css/ReviewModal.css';

/**
 * ReviewModal
 * props:
 *  - isOpen: boolean, 모달 열기/닫기
 *  - onClose: function, 닫기 콜백
 *  - onSubmit: function({ rating, comment }), 제출 콜백
 */
const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 별점 클릭 핸들러 (.5 단위 지원)
  const handleClick = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const newRating = x < width / 2 ? index - 0.5 : index;
    setRating(newRating);
  };

  // 별점 렌더링 헬퍼 (클릭한 rating 기준)
  const renderStar = (starIndex) => {
    if (rating >= starIndex) {
      return <FaStar className="star filled" />;
    } else if (rating >= starIndex - 0.5) {
      return <FaStarHalfAlt className="star half" />;
    } else {
      return <FaRegStar className="star empty" />;
    }
  };

  const handleSubmit = () => {
    const intRating = Math.round(rating * 2);
    onSubmit({ rating: intRating, comment });
    onClose();
  };

  return (
    <div className="rm_overlay" onClick={onClose}>
      <div className="rm_content" onClick={e => e.stopPropagation()}>
        <h3>리뷰 작성</h3>
        <div className="rm_stars">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="rm_star-wrapper"
              onClick={e => handleClick(e, i)}
            >
              {renderStar(i)}
            </div>
          ))}
        </div>
        <textarea
          className="rm_textarea"
          placeholder="리뷰를 작성해주세요..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className="rm_actions">
          <button className="rm_btn cancel" onClick={onClose}>취소</button>
          <button className="rm_btn submit" onClick={handleSubmit} disabled={rating === 0}>
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
