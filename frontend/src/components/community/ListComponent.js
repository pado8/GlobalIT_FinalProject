// ListComponent.jsx
import { useCallback, useEffect, useState } from "react";
import { getList } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "./PageComponent";
import { useNavigate } from "react-router-dom";
import styles from "./ListComponent.module.css";

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

const ListComponent = () => {
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
    <div className={styles.list_component}>
      <div className={styles.list_header}>
        <div className={styles.list_title}>커뮤니티</div>
        <div className={styles.search_box}>
          <input type="text" placeholder="게시글 검색..." className={styles.search_input} />
          <button className={styles.search_btn}>🔍 검색</button>
        </div>
        <div className={styles.write_btn} onClick={handleClickWrite}>
          ✏️ 글쓰기
        </div>
      </div>

      <div className={styles.board_table}>
        <div className={styles.table_header}>
          <div>번호</div>
          <div>제목</div>
          <div className={styles.hide_mobile}>작성자</div>
          <div className={styles.hide_mobile}>작성일</div>
          <div>조회수</div>
        </div>
        {serverData.dtoList.map(community => (
          <div
            key={community.pno}
            className={styles.table_row}
            onClick={() => moveToRead(community.pno)}
          >
            <div className={styles.post_number}>{community.pno}</div>
            <div className={styles.post_title}>{community.ptitle}</div>
            <div className={`${styles.post_meta} ${styles.hide_mobile}`}>{community.mno}</div>
            <div className={`${styles.post_meta} ${styles.hide_mobile}`}>{community.dueDate}</div>
            <div className={styles.post_meta}>{community.view}</div>
          </div>
        ))}
      </div>

      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListComponent;