import { useEffect, useState } from "react";
import { getOne } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";

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

    useEffect(() => {
        getOne(pno).then((data) => {
            console.log(data);
            setCommunity(data);
        });
    }, [pno]);

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4">
            {makeDiv("글 번호", community.pno)}
            {makeDiv("작성자 (회원번호)", community.mno)}
            {makeDiv("제목", community.ptitle)}
            {makeDiv("내용", community.pcontent)}
            {makeDiv("작성일", community.pregdate)}

            {/* 이미지가 있을 때만 출력 */}
            {community.pimage && (
                <div className="flex justify-center mb-4">
                    <img
                        src={community.pimage}
                        alt="첨부 이미지"
                        className="max-w-full h-auto rounded shadow-md"
                    />
                </div>
            )}

            {makeDiv("조회수", community.view)}

            <div className="flex justify-end p-4">
                <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500" onClick={moveToList} >
                    목록
                </button>
                <button type="button" className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500" onClick={() => moveToModify(pno)} >
                    수정
                </button>
            </div>
        </div>
    );
};

const makeDiv = (label, value) => (
    <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">{label}</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
                {value}
            </div>
        </div>
    </div>
);

export default ReadComponent;
