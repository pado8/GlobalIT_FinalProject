import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [userid, setUserid] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 세션 쿠키를 포함해서 전송
        body: JSON.stringify({ userid, passwd }),
      });

      if (!res.ok) throw new Error("로그인 실패");

      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디</label>
          <br />
          <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} required />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>비밀번호</label>
          <br />
          <input type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ marginTop: "1rem" }}>
          로그인
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
}

export default LoginPage;
