import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../login/LoginPage.css";
import logo from "../../assets/img/kickauction_logo.png";
import emailicon from "../../assets/img/icon_email.svg";
import pwicon from "../../assets/img/icon_password.svg";
import socialg from "../../assets/img/social_g.png";
import socialk from "../../assets/img/social_k.png";

function LoginPage() {
  return (
    <div className="login_container">
      <div className="login_smallcontainer">
        <img src={logo} alt="킥옥션 로고" className="login_logo" />

        <form class="form_1" method="POST" action="http://localhost:8080/login">
          <div class="section_1">
            <img src={emailicon} alt="사용자 아이콘" className="email_icon"></img>
            <input type="text" name="username" className="login_input" placeholder="이메일 주소" required />
          </div>
          <div class="section_1">
            <img src={pwicon} alt="비밀번호 아이콘" className="password_icon"></img>
            <input type="password" name="password" className="login_input" placeholder="비밀번호" required />
          </div>

          <div className="login_remember">
            <label>
              <input type="checkbox" />
              이메일 기억하기
            </label>
          </div>

          <button type="submit" className="login_button">
            로그인
          </button>
        </form>

        <div className="social_login_icons">
          <img src={socialk}></img>
          <img src={socialg}></img>
        </div>

        <div className="login_help">
          <Link to="/findid">아이디/비밀번호 찾기</Link>
          <span>|</span>
          <Link to="/presignup">킥옥션 회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
