import React, { useEffect } from "react";
import bgLogin from "../../assets/bgLogin.png";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getStorage } from "../../services/Utils";
function LayoutLogin() {
  const location = useLocation();
  useEffect(() => {
    if (getStorage("isLogedIn")) {
      useNavigate("/dashboard");
    }
  }, [location.pathname]);
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden md:flex w-1/2 bg-[#0b0b0b] rounded-3xl overflow-hidden items-center justify-center  m-1">
        <img src={bgLogin} alt="" className="h-[99vh]" />
      </div>
      <Outlet />
    </div>
  );
}

export default LayoutLogin;
