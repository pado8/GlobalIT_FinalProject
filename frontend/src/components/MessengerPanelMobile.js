import React, { useState } from "react";
import ChatRoomList from "./ChatRoomList";
import MobileChatRoom from "./MobileChatRoom";

const MessengerPanelMobile = () => {
  const [view, setView] = useState("list");
  const [currentRoom, setCurrentRoom] = useState(null);

  const openChatRoom = (room) => {
    setCurrentRoom(room);
    setView("chat");
  };

  const backToList = () => {
    setCurrentRoom(null);
    setView("list");
  };

  return <div className="mobile-messenger-panel">{view === "list" ? <ChatRoomList onRoomClick={openChatRoom} /> : <MobileChatRoom room={currentRoom} onBack={backToList} />}</div>;
};

export default MessengerPanelMobile;
