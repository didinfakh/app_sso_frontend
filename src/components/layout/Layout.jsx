import React from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <div>layout</div>
      <Outlet />
    </div>
  );
}

export default Layout;
