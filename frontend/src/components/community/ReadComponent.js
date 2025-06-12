import { useEffect, useState } from "react";
import { getOne, deleteOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "./ResultModal";
import "./ReadComponent.css";

const initState = {
    pno: 0,
    pcontent: "",
    pregdate: "",  // TIMESTAMP
    pimage: "",    // 이미지 URL
    mno: 0,        // 작성자 회원번호
    ptitle: "",
    view: 0        // 조회수
};

const ReadComponent = ({ pno }) => {
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

    //모달 창이 close될때 
    const closeModal = () => {
        moveToList()
    }

    return (
        <div id="readComponent">
            {result ? <ResultModal title={'처리결과'} content={result} callbackFn={closeModal}></ResultModal> : <></>}
            {makeDiv("글 번호", community.pno)}
            {makeDiv("작성자 (회원번호)", community.mno)}
            {makeDiv("제목", community.ptitle)}
            {makeDiv("내용", community.pcontent)}
            {makeDiv("작성일", community.pregdate)}

            {/* 이미지가 있을 때만 출력 */}
            {community.pimage && (
                <div>
                    <img
                        src={community.pimage}
                        alt="첨부 이미지"
                    />
                </div>
            )}

            {makeDiv("조회수", community.view)}

            <div>
                <button type="button" onClick={moveToList} >
                    목록
                </button>
                <button type="button" onClick={() => moveToModify(pno)} >
                    수정
                </button>
                <button type="button" onClick={handleClickDelete} >
                    삭제
                </button>
            </div>
        </div>
    );
};

const makeDiv = (label, value) => (
    <div>
        <div>
            <div>{label}</div>
            <div>
                {value}
            </div>
        </div>
    </div>
);

export default ReadComponent;
