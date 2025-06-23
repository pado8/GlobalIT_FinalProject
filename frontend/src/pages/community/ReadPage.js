import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, deleteOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/ReadPage.css";

const initState = {
    pno: 0,
    pcontent: "",
    pregdate: "",  // TIMESTAMP
    pimage: "",    // 이미지 URL
    mno: 0,        // 작성자 회원번호
    writerName: "", // 작성자 닉네임
    ptitle: "",
    view: 0        // 조회수
};

const ReadPage = () => {
    const { pno } = useParams();
    const [community, setCommunity] = useState(initState);
    const { moveToList, moveToModify } = useCustomMove();
    const { user } = useAuth();

    // **삭제 확인 모달 표시 여부**
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        getOne(pno)
            .then((data) => setCommunity({ ...data }))
            .catch(err => console.error(err));
    }, [pno]);

    // 1) 삭제 버튼 눌렀을 때 모달 띄우기
    const handleClickDelete = () => {
        setShowConfirm(true);
    };

    // 2) 모달에서 “확인” 눌렀을 때 실제 삭제
    const confirmDelete = () => {
        deleteOne(pno)
            .then(() => {
                setShowConfirm(false);
                moveToList();  
            })
            .catch(err => console.error(err));
    };

    // 3) 모달에서 “취소” 눌렀을 때 닫기
    const cancelDelete = () => {
        setShowConfirm(false);
    };

    function formatDisplayDate(isoString) {
        const d = new Date(isoString);
        const today = new Date();
        const isToday =
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();
        if (isToday) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }

    const isAuthor = user && user.mno === community.mno;

    return (
        <div id="read_Page">
            {/* 삭제 확인 모달 */}
            {showConfirm && (
                <>
                    {/* 딤 배경 */}
                    <div className="confirm-overlay" />
                    {/* 중앙 모달 박스 */}
                    <div className="confirm-modal">
                        <p>정말 이 글을 삭제하시겠습니까?</p>
                        <div className="confirm-buttons">
                            <button className="btn" onClick={confirmDelete}>확인</button>
                            <button className="btn" onClick={cancelDelete}>취소</button>
                        </div>
                    </div>
                </>
            )}

            <div className="btn_box">
                <button type="button" className="btn" onClick={moveToList}>
                    ← 목록으로 돌아가기
                </button>
                {isAuthor && (
                    <div className="action_buttons">
                        <button type="button" className="btn" onClick={() => moveToModify(pno)}>
                            수정
                        </button>
                        <button type="button" className="btn" onClick={handleClickDelete}>
                            삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="read_container">
                <div className="read_header">
                    <h1 className="read_title">{community.ptitle}</h1>
                    <div className="read_meta">
                        <div className="read_info">
                            <span>👤 {community.writerName || community.mno}</span>
                            <span>📅 {formatDisplayDate(community.pregdate)}</span>
                            <span>👁 {community.view}</span>
                        </div>
                    </div>
                </div>

                <div className="read_content">
                    {community.pcontent}
                    {community.pimage && (
                        <div>
                            <img
                                src={`${process.env.REACT_APP_API_URL || "http://localhost:8080"}${community.pimage}`}
                                alt="첨부 이미지"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="comments_section">
                <div className="comments_header">💬 댓글 8개</div>
                <div className="comment_form clearfix">
                    <textarea className="comment_input" placeholder="댓글을 입력하세요..." />
                    <button className="comment_submit" onClick={() => { }}>댓글 작성</button>
                </div>
            </div>

            <div className="navigation">
                <button className="nav_btn">← 이전 글: 골키퍼 장갑 관리 꿀팁</button>
                <button className="nav_btn">다음 글: 축구공 대여 역경매 →</button>
            </div>
        </div>
    );
};

export default ReadPage;
