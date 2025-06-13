import { useState } from "react";
import { postWrite } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";

const initState = {
  title: "",
  content: "",
  memberId: ""  // 실제 로그인한 회원 ID를 할당하세요
};

const WriteComponent = () => {
  const [community, setCommunity] = useState({ ...initState });
  const { moveToList } = useCustomMove();

  const handleChangeCommunity = (e) => {
    const { name, value } = e.target;
    setCommunity((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickWrite = () => {
    postWrite(community)
      .then(() => {
        // 저장 성공하면 바로 목록으로 이동
        moveToList();
      })
      .catch((err) => {
        console.error("글쓰기 실패:", err);
        // 필요 시 에러 처리 UI 추가
      });
  };

  return (
    <div>
      <h2>새 글 작성</h2>
      <div>
        <label>제목</label>
        <input
          type="text"
          name="ptitle"
          value={community.ptitle}
          onChange={handleChangeCommunity}
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          name="pcontent"
          value={community.pcontent}
          onChange={handleChangeCommunity}
        />
      </div>
      {/* 로그인 정보에서 memberId를 가져온다면 아래 input은 제거하세요 */}
      <div>
        <label>회원 ID</label>
        <input
          type="text"
          name="mno"
          value={community.mno}
          onChange={handleChangeCommunity}
        />
      </div>
      <button onClick={handleClickWrite}>저장</button>
    </div>
  );
};

export default WriteComponent;
