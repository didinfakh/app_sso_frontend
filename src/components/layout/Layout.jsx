import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import useIdleLogout from "../../services/UseIdleLogout";
import { getStorage } from "../../services/Utils";
import Sidebar from "./Sidebar";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  useIdleLogout();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!getStorage("isLogedIn")) {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  // Handle route change to close mobile sidebar
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fe]">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
