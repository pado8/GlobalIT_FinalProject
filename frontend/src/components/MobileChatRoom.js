import React, { useEffect, useRef, useState } from "react";
import "./MobileChatRoom.css"; // 추후 스타일링
import { formatTime } from "../utils/dateUtil";

const MobileChatRoom = ({ room, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const scrollRef = useRef();

  // 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/dialog?target=${room.partnerMno}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
        scrollToBottom();
      } catch (err) {
        console.error("대화 불러오기 실패", err);
      }
    };
    fetchMessages();
  }, [room]);

  // 스크롤 맨 아래로
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!content.trim()) return;
    try {
      const params = new URLSearchParams();
      params.append("receiverId", room.partnerMno);
      params.append("content", content);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: params.toString(),
      });

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setContent("");
      scrollToBottom();
    } catch (err) {
      console.error("메시지 전송 실패", err);
    }
  };

  return (
    <div className="mobile-chatroom">
      <div className="chatroom-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <img src={`/upload/${room.partnerProfileImg || "baseprofile.png"}`} alt="profile" className="chatroom-header-avatar" />
        <span className="chatroom-header-name">{room.partnerName}</span>
      </div>

      <div className="chatroom-body">
        {messages.map((msg) => (
          <div key={msg.msgId} className={`chat-bubble ${msg.senderId === room.partnerMno ? "received" : "sent"}`}>
            <div className="chat-content">{msg.content}</div>
            <div className="chat-time">{formatTime(msg.sentAt)}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="chatroom-input">
        <input type="text" placeholder="메시지 입력..." value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default MobileChatRoom;
