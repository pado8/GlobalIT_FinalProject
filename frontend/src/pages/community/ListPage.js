import { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "./PageComponent";
import { useNavigate } from "react-router-dom";
import "../../css/ListPage.css";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
};

const ListPage = () => {
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const navigate = useNavigate();

  const handleClickWrite = useCallback(() => {
    navigate("/community/write");
  }, [navigate]);

  useEffect(() => {
    getList({ page, size })
      .then(data => setServerData(data))
      .catch(err => console.error(err));
  }, [page, size, refresh]);

  return (
    <div id="list_page">
      <div className="list_header">
        <div className="list_title">커뮤니티</div>
        <div className="search_box">
          <input className="search_input" name="search_input" type="text" placeholder="게시글 검색..." />
          <button className="btn">🔍 검색</button>
        </div>
        <div className="btn write_btn" onClick={handleClickWrite}>
          ✏️ 글쓰기
        </div>
      </div>

      <div className="board_table">
        <div className="table_header">
          <div>번호</div>
          <div>제목</div>
          <div className="hide_mobile">작성자</div>
          <div className="hide_mobile">작성일</div>
          <div>조회수</div>
        </div>
        {serverData.dtoList.map(community => (
          <div
            key={community.pno}
            className="table_row"
            onClick={() => moveToRead(community.pno)}
          >
            <div className="post_number">{community.pno}</div>
            <div className="post_title">{community.ptitle}</div>
            <div className="post_meta hide_mobile">{community.mno}</div>
            <div className="post_meta hide_mobile">{community.dueDate}</div>
            <div className="post_meta">{community.view}</div>
          </div>
        ))}
      </div>

      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListPage;
