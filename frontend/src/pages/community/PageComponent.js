import "../../css/ListPage.css";

const PageComponent = ({ serverData, movePage }) => {
    return (
        <div className="pagination">
            {serverData.prev ? (
                <div
                    className="page_btn"
                    onClick={() => movePage({ page: serverData.prevPage })}
                >
                    이전
                </div>
            ) : null}

            {serverData.pageNumList.map((pageNum) => (
                <div
                    key={pageNum}
                    className={`page_btn ${serverData.current === pageNum ? 'active' : ''}`}
                    onClick={() => movePage({ page: pageNum })}
                >
                    {pageNum}
                </div>
            ))}

            {serverData.next ? (
                <div
                    className="page_btn"
                    onClick={() => movePage({ page: serverData.nextPage })}
                >
                    다음
                </div>
            ) : null}
        </div>
    );
};

export default PageComponent;
