import { Outlet, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const CommunityPage = () => {
    const navigate = useNavigate()
    const handleClickList = useCallback(() => { navigate({ pathname: 'list' }) })
    const handleClickWrite = useCallback(() => { navigate({ pathname: 'write' }) })
    return (
        <div id="communityPage">
            Community Page
            <div onClick={handleClickList}>List</div>
            <div onClick={handleClickWrite}>Write</div>
            <div><Outlet /></div>
        </div>
    );
}
export default CommunityPage;