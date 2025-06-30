import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import Chattingicon from "./Chatting";
import MessengerPanel from "./MessengerPanel";
import { useAuth } from "../contexts/Authcontext";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const { user } = useAuth();

  const openMessengerWithUser = (user) => {
    setChatTarget(user);
    setChatOpen(true);
  };

  return (
    <>
      <Nav />
      <div id="wrap">
        <Outlet context={{ openMessengerWithUser }} />
      </div>
      <Chattingicon onClick={() => setChatOpen((prev) => !prev)} />
      {user && chatOpen && <MessengerPanel onClose={() => setChatOpen(false)} />}
      <Footer />
    </>
  );
};

export default Layout;
