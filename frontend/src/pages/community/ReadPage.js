import { useCallback } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReadComponent from "../../components/community/ReadComponent";


const ReadPage = () => {
    const { pno } = useParams()
    const navigate = useNavigate()
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10
    const queryStr = createSearchParams({ page, size }).toString()
    const moveToModify = useCallback((pno) => { navigate({ pathname: `/community/modify/${pno}`, search: queryStr }) }, [pno, page, size])
    const moveToList = useCallback(() => { navigate({ pathname: `/community/list`, search: queryStr }) }, [page, size])


    return (
        <div id="readPage">
            community Read Page Component {pno}
            <button onClick={() => moveToModify(pno)}>Test Modify</button>
            <button onClick={() => moveToList()}>Test List</button>
            <ReadComponent pno={pno}></ReadComponent>
        </div>
    );
}
export default ReadPage;