import { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "./PageComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
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
  const { user } = useAuth();

  // 검색어, 검색 대상 상태 추가
  const [searchType, setSearchType] = useState("t");
  const [keyword, setKeyword] = useState("");

  // 글쓰기 버튼
  const handleClickWrite = useCallback(() => {
    if (user) {
      navigate("/community/write");
    } else if (window.confirm("글 작성을 위해 로그인해야 합니다. 로그인 페이지로 이동할까요?")) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 검색 버튼
  const handleSearch = () => {
    const typeParam = searchType || "t";
    moveToList({ page: 1, size, type: typeParam, keyword });
  };

  // 리스트 조회: page, size, refresh뿐 아니라 검색 조건도 의존성으로 추가
  useEffect(() => {
    getList({ page, size, type: searchType, keyword })
      .then(data => setServerData(data))
      .catch(err => console.error(err));
  }, [page, size, refresh, searchType, keyword]);

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
    <div id="list_page">
      <div className="list_header">
        <div className="list_title">커뮤니티</div>
        <div className="search_box">
          {/* 검색 대상 선택 */}
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="t">제목</option>
            <option value="c">내용</option>
            <option value="tc">제목+내용</option>
          </select>
          {/* 검색어 입력 */}
          <input
            className="search_input"
            type="text"
            placeholder="게시글 검색..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="btn" onClick={handleSearch}>🔍 검색</button>
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
        {serverData.dtoList.map(item => (
          <div
            key={item.pno}
            className="table_row"
            onClick={() => moveToRead(item.pno)}
          >
            <div className="post_number">{item.pno}</div>
            <div className="post_title">{item.ptitle}</div>
            <div className="post_meta hide_mobile">{item.writerName}</div>
            <div className="post_meta hide_mobile">{formatDisplayDate(item.pregdate)}</div>
            <div className="post_meta">{item.view}</div>
          </div>
        ))}
      </div>

      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListPage;
