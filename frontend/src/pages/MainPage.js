import { Link } from "react-router-dom";

const MainPage = () => {
    return (
        <div id="wrap">
            <Link to={'/community'}>커뮤니티 게시판</Link>
            <div>MainPage</div>
        </div>
    );
};

export default MainPage;