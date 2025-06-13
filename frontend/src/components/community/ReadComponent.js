import { useEffect, useState } from "react";
import { getOne, deleteOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "./ResultModal";
import styles from "./ReadComponent.module.css";

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

    const submitComment = () => {
        // 댓글 작성 아직 미구현
    }

    //모달 창이 close될때 
    const closeModal = () => {
        moveToList()
    }

    return (
        <div id="readComponent">
            {result ? <ResultModal title={'처리결과'} content={result} callbackFn={closeModal}></ResultModal> : <></>}
            <div className={styles.btn_box}>
                <button type="button" class={styles.back_to_list} onClick={moveToList} >
                    ← 목록으로 돌아가기
                </button>
                <div>
                    <button type="button" class={styles.back_to_list} onClick={() => moveToModify(pno)} >
                        수정
                    </button>
                    <button type="button" class={styles.back_to_list} onClick={handleClickDelete} >
                        삭제
                    </button>
                </div>
            </div>
            <div className={styles.post_container}>
                <div class={styles.post_header}>
                    <h1 class={styles.post_title}>{community.ptitle}</h1>
                    <div class={styles.post_meta}>
                        <div class={styles.post_info}>
                            <span>👤 {community.mno}</span>
                            <span>📅 {community.pregdate}</span>
                            <span>👁 {community.view}</span>
                            {/* <span>💬 댓글 8</span> 아직 미구현*/}
                        </div>
                    </div>
                </div>

                <div class={styles.post_content}>

                    {community.pcontent}
                    {/* 이미지가 있을 때만 출력 */}
                    {community.pimage && (
                        <div>
                            <img
                                src={community.pimage}
                                alt="첨부 이미지"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div class={styles.comments_section}>
                <div class={styles.comments_header}>
                    💬 댓글 8개
                </div>
                <div class={`${styles.comment_form} ${styles.clearfix}`}>
                    <textarea class={styles.comment_input} placeholder="댓글을 입력하세요..."></textarea>
                    <button class={styles.comment_submit} onclick={submitComment()}>댓글 작성</button>
                </div>
            </div>



        </div >
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