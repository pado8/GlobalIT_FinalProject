// src/pages/community/ListPage.js
import { useEffect, useState } from "react";
import { getList } from "../../api/communityApi";
import PageComponent from "./PageComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import "../../css/ListPage.css";

function formatDisplayDate(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
}

const ListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sizeParam = parseInt(searchParams.get("size") || "10", 10);

  const [page, setPage] = useState(pageParam);
  const [size] = useState(sizeParam);

  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    prevPage: 0,
    nextPage: 0,
    current: 0,
    totalPage: 0,
  });

  const [searchType, setSearchType] = useState("t");
  const [keyword, setKeyword] = useState("");

  // 데이터 로드 및 URL 동기화
  useEffect(() => {
    setSearchParams({ page, size });

    getList({ page, size, type: searchType, keyword })
      .then((data) => {
        setServerData({
          dtoList: data.dtoList || [],
          pageNumList: data.pageNumList || [],
          pageRequestDTO: data.pageRequestDTO,
          prev: data.prev,
          next: data.next,
          prevPage: data.prevPage,
          nextPage: data.nextPage,
          current: data.current,
          totalPage: data.totalPage,
        });
      })
      .catch((err) => {
        console.error("리스트 로드 실패:", err);
        setServerData((prev) => ({
          ...prev,
          dtoList: [],
          pageNumList: [],
        }));
      });

    window.scrollTo(0, 0);
  }, [page, size, searchType, keyword, setSearchParams]);

  const handleClickWrite = () => {
    if (user) {
      navigate("/community/write");
    } else if (
      window.confirm("글 작성을 위해 로그인해야 합니다. 로그인 페이지로 이동할까요?")
    ) {
      navigate("/login");
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div id="list_page">
      <div className="list_header">
        <div className="list_title">커뮤니티</div>
        <div className="search_box">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="t">제목</option>
            <option value="c">내용</option>
            <option value="tc">제목+내용</option>
          </select>
          <input
            className="search_input"
            type="text"
            placeholder="게시글 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="btn" onClick={handleSearch}>
            🔍 검색
          </button>
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

        {(serverData.dtoList || []).map((item) => (
          <div
            key={item.pno}
            className="table_row"
            onClick={() =>
              navigate(
                `/community/read/${item.pno}?page=${page}&size=${size}`
              )
            }
          >
            <div className="post_number">{item.pno}</div>
            <div className="post_title">{item.ptitle}</div>
            <div className="post_meta hide_mobile">
              {item.writerName || item.mno}
            </div>
            <div className="post_meta hide_mobile">
              {formatDisplayDate(item.pregdate)}
            </div>
            <div className="post_meta">{item.view}</div>
          </div>
        ))}

        {serverData.dtoList.length === 0 && (
          <div className="no_data">등록된 게시글이 없습니다.</div>
        )}
      </div>

      <PageComponent
        serverData={serverData}
        onPageChange={(num) => setPage(num)}
      />
    </div>
  );
};

export default ListPage;
