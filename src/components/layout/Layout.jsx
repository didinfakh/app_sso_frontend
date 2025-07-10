import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import useIdleLogout from "../../services/UseIdleLogout";
import { getStorage } from "../../services/Utils";

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
    <div>
      <Navbar />
      <div>layout</div>
      <Outlet />
    </div>
  );
}

export default Layout;
