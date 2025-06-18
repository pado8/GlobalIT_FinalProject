import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, deleteOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "./ResultModal";
import "../../css/ReadPage.css";

const initState = {
    pno: 0,
    pcontent: "",
    pregdate: "",  // TIMESTAMP
    pimage: "",    // 이미지 URL
    mno: 0,        // 작성자 회원번호
    ptitle: "",
    view: 0        // 조회수
};

const ReadPage = () => {
    const { pno } = useParams()
    const [community, setCommunity] = useState(initState);
    const { moveToList, moveToModify } = useCustomMove();
    //모달 창을 위한 상태 
    const [result, setResult] = useState(null)

    useEffect(() => {
        getOne(pno).then((data) => {
            console.log(data);
            setCommunity(data);
        });
    }, [pno]);

    const handleClickDelete = () => { //버튼 클릭시 

        deleteOne(pno).then(data => {
            console.log("delete result: " + data)
            setResult('Deleted')
        })

    }

    const submitComment = () => {
        // 댓글 작성 아직 미구현
    }

    //모달 창이 close될때 
    const closeModal = () => {
        moveToList()
    }

    function formatDisplayDate(isoString) {
    const d = new Date(isoString);
    const today = new Date();

    // 날짜(연-월-일)만 비교
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    if (isToday) {
      // 시간(HH:mm)만
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // 년-월-일
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }

    return (
        <div id="read_Page">
            {result ? <ResultModal title={'처리결과'} content={result} callbackFn={closeModal}></ResultModal> : <></>}
            <div className="btn_box">
                <button type="button" className="btn" onClick={moveToList} >
                    ← 목록으로 돌아가기
                </button>
                <div>
                    <button type="button" className="btn" onClick={() => moveToModify(pno)} >
                        수정
                    </button>
                    <button type="button" className="btn" onClick={handleClickDelete} >
                        삭제
                    </button>
                </div>
            </div>
            <div className="read_container">
                <div className="read_header">
                    <h1 className="read_title">{community.ptitle}</h1>
                    <div className="read_meta">
                        <div className="read_info">
                            <span>👤 {community.mno}</span>
                            <span>📅 {formatDisplayDate(community.pregdate)}</span>
                            <span>👁 {community.view}</span>
                            {/* <span>💬 댓글 8</span> 아직 미구현*/}
                        </div>
                    </div>
                </div>

                <div className="read_content">

                    {community.pcontent}
                    {/* 이미지가 있을 때만 출력 */}
                    {community.pimage && (
                        <div>
                            <img
                                // process.env.REACT_APP_API_URL에 "http://localhost:8080" 등을 담아두시면 편합니다.
                                src={`${process.env.REACT_APP_API_URL || "http://localhost:8080"}${community.pimage}`}
                                alt="첨부 이미지"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="comments_section">
                <div className="comments_header">
                    💬 댓글 8개
                </div>
                <div className="comment_form clearfix">
                    <textarea className="comment_input" placeholder="댓글을 입력하세요..."></textarea>
                    <button className="comment_submit" onClick={submitComment}>댓글 작성</button>
                </div>
            </div>

            <div className="navigation">
                <button className="nav_btn">← 이전 글: 골키퍼 장갑 관리 꿀팁</button>
                <button className="nav_btn">다음 글: 축구공 대여 역경매 →</button>
            </div>


        </div >
    );
};

export default ReadPage;