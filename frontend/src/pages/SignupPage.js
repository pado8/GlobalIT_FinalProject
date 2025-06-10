import React, { useState } from "react";
import "../pages/SignupPage.css";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="signup_container">
      <div className="signup_smallcontainer">
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#3fb6be", fontSize: "2.7rem" }}>Welcome !</h1>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: "500" }}>일반유저 회원가입</h2>

        <form className="signup_form">
          <input type="email" className="login_input input" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="button" className="email_duplicheck">
            중복확인
          </button>

          <input type="text" className="nickname_input input" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          <button type="button" className="nickname_duplicheck">
            중복확인
          </button>

          <input type="password" className="password_input input" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" className="password_check_input input" placeholder="비밀번호 재입력" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />

          <input type="tel" className="tel_input input" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <button type="button" className="check_button">
            인증받기
          </button>

          <button type="button" className="company_signup">
            업체 회원가입
          </button>

          <button type="button" className="social_signup_k">
            카카오 계정으로 회원가입
          </button>
          <button type="button" className="social_signup_g">
            구글 계정으로 회원가입
          </button>

          <button type="submit" className="login_button">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
