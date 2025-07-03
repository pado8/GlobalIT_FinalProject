import React, { useEffect, useState } from "react";
import "./ChatRoomList.css";
import { formatTime } from "../api/dateUtil";

const ChatRoomList = ({ onRoomClick }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/messages/rooms", {
          credentials: "include",
        });
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("채팅방 목록 조회 실패", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="chat-room-list">
      <h2 className="chat-list-title">채팅</h2>
      {rooms.map((room) => (
        <div key={room.partnerMno} className="chat-room-item" onClick={() => onRoomClick(room)}>
          <img src={`/upload/${room.partnerProfileImg || "baseprofile.png"}`} alt="profile" className="chat-room-avatar" />
          <div className="chat-room-info">
            <div className="chat-room-top">
              <span className="chat-room-name">{room.partnerName}</span>
              <span className="chat-room-time">{formatTime(room.lastSentAt)}</span>
            </div>
            <div className="chat-room-bottom">
              <span className="chat-room-preview">{room.lastMessage}</span>
              {room.unreadCount > 0 && <span className="chat-room-badge">{room.unreadCount}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
