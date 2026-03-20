import React, { useState, useRef, useEffect } from "react";
import { getStorage } from "../../services/Utils";
import { useLocation } from "react-router";

const Navbar = ({ onMenuToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [user, setUser] = useState({});
  const location = useLocation();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageTitle =
    pathParts.length > 0
      ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1)
      : "Dashboard";

  useEffect(() => {
    const userStorage = getStorage("user");
    setUser(userStorage || {});

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10 w-full shrink-0">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Title & Mobile Toggle */}
        <div className="flex items-center gap-x-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
              {pageTitle}
            </h2>
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-3 text-gray-400">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <i className="far fa-bell"></i>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 hover:text-gray-700 transition-colors">
              <i className="far fa-envelope"></i>
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center gap-2 hover:bg-gray-50 p-1 md:p-1.5 rounded-lg transition-colors focus:outline-none"
            >
              <span className="hidden md:flex flex-col items-end mr-1 text-right">
                <span className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-gray-500">Super Admin</span>
              </span>
              <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 bg-blue-100 rounded-full text-blue-600 font-bold text-[12px] md:text-sm border-2 border-white shadow-sm overflow-hidden shrink-0">
                {user?.initials || (
                  <i className="fas fa-user text-gray-400"></i>
                )}
              </div>
              <i className="fas fa-chevron-down text-[10px] text-gray-400 ml-1 hidden md:block"></i>
            </button>

            {/* Menu Dropdown Profil */}
            <div
              className={`
                ${isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 origin-top-right transition-all duration-200 z-50
              `}
            >
              <div className="px-4 py-2 border-b border-gray-100 mb-1 md:hidden">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <i className="far fa-user w-5 text-center mr-2"></i> Your
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <i className="fas fa-cog w-5 text-center mr-2"></i> Settings
              </a>
              <div className="h-px bg-gray-100 my-1"></div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <i className="fas fa-sign-out-alt w-5 text-center mr-2"></i>{" "}
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
