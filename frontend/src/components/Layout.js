import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";


const Layout = () => {
  return (
    <>
      <Nav />
      <div id="wrap">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
