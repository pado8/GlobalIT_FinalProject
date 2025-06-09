import { Link } from "react-router-dom";

const MainPage = () => {
    return (
        <div id="wrap">
            <div>MainPage</div>
            <div><Link to={'/community'}>커뮤니티 게시판</Link></div>
            <div><Link to={'/sellerlist'}>업체목록 리스트</Link></div>
        </div>
    );
};

export default MainPage;