import { Outlet, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const CommunityPage = () => {
    const navigate = useNavigate()
    const handleClickList = useCallback(() => { navigate({ pathname: 'list' }) })
    const handleClickAdd = useCallback(() => { navigate({ pathname: 'add' }) })
    return (
        <div id="communityPage">
            Community Page
            <div onClick={handleClickList}>List</div>
            <div onClick={handleClickAdd}>Add</div>
            <div><Outlet /></div>
        </div>
    );
}
export default CommunityPage;