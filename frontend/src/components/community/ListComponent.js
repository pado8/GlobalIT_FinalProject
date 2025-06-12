import { useEffect, useState } from "react";
import { getList } from "../../api/communityApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "./PageComponent";

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
}

const ListComponent = () => {
    const { page, size, refresh, moveToList, moveToRead } = useCustomMove()//refresh
    //serverData는 나중에 사용
    const [serverData, setServerData] = useState(initState)

    useEffect(() => {
        getList({ page, size }).then(data => {
            console.log("=== 서버에서 온 community 리스트 ===", data.dtoList);
            console.log(data)
            setServerData(data)
        })
        .catch(err => console.error(err));
    }, [page, size, refresh])

    return (
        <div id="listComponent">
            <div>
                {serverData.dtoList.map(community =>
                    <div key={community.pno}>
                        <div>
                            <div>
                                {community.pno}
                            </div>
                            <button onClick={() => moveToRead(community.pno)}>
                                {community.mno}
                            </button>
                            <div>
                                {community.dueDate}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    );
}

export default ListComponent;