import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import useIdleLogout from "../../services/UseIdleLogout";
import { getStorage } from "../../services/Utils";
import Sidebar from "./Sidebar";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  useIdleLogout();
  useEffect(() => {
    if (!getStorage("isLogedIn")) {
      navigate("/login");
    }
  }, [location.pathname]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
