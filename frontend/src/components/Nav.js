import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import styles from "./Nav.module.css";
import "../css/Sharesheet.css";
import logo2 from "../assets/img/logo_v2.png";
import { IoHome } from "react-icons/io5";
import { BsChatDotsFill } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { BsPersonFillGear } from "react-icons/bs";
import { MdPersonAdd } from "react-icons/md";

const Nav = ({ onChatClick, chatOpen, unreadCount }) => {
  const location = useLocation(); //주석: 현재 위치한 탭을 인식해 가상요소 효과 적용.

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [latestRequestCount, setLatestRequestCount] = useState(null);
  const [hasRequest, setHasRequest] = useState(true);
  const { user, setUser } = useAuth();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // 주석: 로그아웃
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://3.37.151.29:8080/logout", {
        method: "POST",
        credentials: "include",
      });

      //주석:: 로그아웃 후 이동위치
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("로그아웃 실패", err);
    }
  };
  // 주석: (모바일) 메뉴 이동 시 사이드바 닫음
  const handleLinkClick = () => {
    closeSidebar();
  };

  // 주석: 최근order에 달린 biz개수 가져오기
  useEffect(() => {
    const fetchLatestBizCount = async () => {
      try {
        const res = await fetch(`/api/members/${user.mno}/latest-biz-count`);
        if (!res.ok) {
          console.error("서버 오류:", res.status);
          return;
        }

        const countData = await res.json();

        if (typeof countData.count === "number") {
          setLatestRequestCount(countData.count);
          setHasRequest(countData.hasRequest); // ✅ 상태 추가
        } else {
          console.warn("예상치 못한 응답 형태:", countData);
          setLatestRequestCount(0);
          setHasRequest(false);
        }
      } catch (err) {
        console.error("제안 수 불러오기 실패", err);
        setLatestRequestCount(0);
        setHasRequest(false);
      }
    };

    if (user) fetchLatestBizCount();
  }, [user]);

  return (
    <>
      <nav className={styles.nav} id="header">
        {/* 로고 영역 */}
        <Link to="/" className={styles.nav_logo}>
          <img src={logo2} alt="킥옥션 로고" />
        </Link>

        {/* 메뉴 탭 영역 */}
        <ul className={styles.nav_menu}>
          <li className={location.pathname.startsWith("/request") ? styles.active : ""}>
            <Link to="/request">견적 요청</Link>
          </li>
          <li className={location.pathname.startsWith("/orderlist") ? styles.active : ""}>
            <Link to="/orderlist">견적 목록</Link>
          </li>
          <li className={location.pathname.startsWith("/sellerlist") ? styles.active : ""}>
            <Link to="/sellerlist">등록된 업체 목록</Link>
          </li>
          <li className={location.pathname.startsWith("/community") ? styles.active : ""}>
            <Link to="/community">자유게시판</Link>
          </li>
          <li className={location.pathname.startsWith("/help") ? styles.active : ""}>
            <Link to="/help">고객센터</Link>
          </li>
        </ul>

        {/* 로그인/회원가입 or 사용자 메뉴 */}
        <div className={styles.nav_auth}>
          {!user ? (
            <Link to="/login" state={{ from: location.pathname }} className={styles.loginbtn}>
              로그인 / 회원가입
            </Link>
          ) : (
            <div className={styles.user_dropdown}>
              <button onClick={toggleDropdown} className={styles.user_button}>
                {user.nickname} 님{" "}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#555">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <div className={`${styles.user_dropdown_box} ${dropdownOpen ? styles.open : ""}`}>
                <img className={styles.profile_img_dropdown} src={`http://3.37.151.29:8080/images/${user.profileimg || "baseprofile.png"}`} alt="프로필 사진" />
                <p>
                  안녕하세요! <br />
                  <strong>{user.nickname}</strong> 님
                </p>
                <p className={styles.recentsuggest}>
                  {!hasRequest ? (
                    "진행 중인 견적 요청이 없어요."
                  ) : (
                    <>
                      최근 견적 요청에 <span className={styles.recentsuggest_count}>{latestRequestCount ?? 0}</span>
                      개의 제안이 도착했어요.
                    </>
                  )}
                </p>
                <div className={styles.sidebar_buttons}>
                  <Link to="/mypage" className={styles.dropdown_btn} onClick={() => setDropdownOpen(false)}>
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className={styles.dropdown_btn}>
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 모바일 전용 상단 바 */}
      <div className={styles.mobile_topbar}>
        <div className={styles.mobile_left} onClick={toggleSidebar}>
          ☰
        </div>
        <div className={styles.mobile_center}>
          <img src={logo2} alt="로고" className={styles.mobile_logo} />
        </div>
        <div className={styles.mobile_right}>⋮</div>
      </div>

      {/* 오버레이 */}
      {isSidebarOpen && <div className={styles.sidebar_overlay} onClick={closeSidebar}></div>}

      {/* 사이드바 */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.show : ""}`}>
        <div className={styles.sidebar_userbox}>
          {!user ? (
            <>
              <img className={styles.profile_img} src={`http://3.37.151.29:8080/images/baseprofile.png`} alt="비로그인 프로필 사진" />
              <p>비로그인 상태입니다.</p>
              <div className={styles.sidebar_buttons}>
                <Link to="/login" state={{ from: location.pathname }} onClick={handleLinkClick} className={styles.sidebar_btn}>
                  로그인
                </Link>
                <Link to="/presignup" onClick={handleLinkClick} className={styles.sidebar_btn}>
                  회원가입
                </Link>
              </div>
            </>
          ) : (
            <>
              <img className={styles.profile_img} src={`http://3.37.151.29:8080/images/${user.profileimg || "baseprofile.png"}`} alt="프로필 사진" />
              <p>
                안녕하세요! <br />
                <strong>{user.nickname}</strong> 님
              </p>
              <p className={styles.recentsuggest}>
                {!hasRequest ? (
                  "진행 중인 견적 요청이 없어요."
                ) : (
                  <>
                    최근 견적 요청에 <span className={styles.recentsuggest_count}>{latestRequestCount ?? 0}</span>
                    개의 제안이 도착했어요.
                  </>
                )}
              </p>
              <div className={styles.sidebar_buttons}>
                <Link to="/mypage" onClick={handleLinkClick} className={styles.sidebar_btn2}>
                  마이페이지
                </Link>
                <button onClick={handleLogout} className={styles.sidebar_btn2}>
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>

        <nav className={styles.sidebar_nav}>
          <Link className={styles.backtohome} to="/" onClick={handleLinkClick}>
            ↩ 메인화면
          </Link>
          <Link to="/request" onClick={handleLinkClick}>
            견적 요청
          </Link>
          <Link to="/orderlist" onClick={handleLinkClick}>
            견적 입찰
          </Link>
          <Link to="/sellerlist" onClick={handleLinkClick}>
            등록된 업체 목록
          </Link>
          <Link to="/community" onClick={handleLinkClick}>
            자유게시판
          </Link>
          <Link to="/help" onClick={handleLinkClick}>
            고객센터
          </Link>
        </nav>
      </div>

      {/* 주석: 모바일 하단 4메뉴 바 */}
      {user && (
        <nav className={styles.mobile_bottomnav}>
          <Link to="/">
            <IoHome className={styles.fourmenuicon} />
            <br />
            메인화면
          </Link>
          <button className={styles.fourmenubutton} onClick={onChatClick}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <BsChatDotsFill className={styles.fourmenuicon} />
              {!chatOpen && unreadCount > 0 && <span className={styles.chat_icon_badge}>{unreadCount}</span>}
            </div>
            <br />
            {chatOpen ? "닫기" : "KickChat"}
          </button>
          <Link to="/community">
            <FaPeopleGroup className={styles.fourmenuicon} />
            <br />
            커뮤니티
          </Link>
          <Link to="/mypage">
            <BsPersonFillGear className={styles.fourmenuicon} />
            <br />
            마이페이지
          </Link>
        </nav>
      )}
      {!user && (
        <nav className={styles.mobile_bottomnav}>
          <Link to="/">
            <IoHome className={styles.fourmenuicon} />
            <br />
            메인화면
          </Link>
          <Link to="/community">
            <FaPeopleGroup className={styles.fourmenuicon} />
            <br />
            커뮤니티
          </Link>
          <Link to="/presignup">
            <MdPersonAdd className={styles.fourmenuicon} />
            <br />
            회원가입
          </Link>
          <Link to="/login" state={{ from: location.pathname }}>
            <LuLogIn className={styles.fourmenuicon} />
            <br />
            로그인
          </Link>
        </nav>
      )}
    </>
  );
};
export default Nav;
