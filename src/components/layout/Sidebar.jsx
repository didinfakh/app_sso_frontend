import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getStorage } from "../../services/Utils";

// Fallback icon berdasarkan label menu
const getIconByLabel = (label = "") => {
  const map = {
    dashboard: "fas fa-home",
    master: "fas fa-folder",
    users: "fas fa-users",
    user: "fas fa-user",
    role: "fas fa-user-shield",
    roles: "fas fa-user-shield",
    proker: "fas fa-clipboard-list",
    laporan: "fas fa-chart-pie",
    report: "fas fa-chart-pie",
    divisi: "fas fa-building",
    anggaran: "fas fa-wallet",
    settings: "fas fa-cog",
    menu: "fas fa-list",
  };
  return map[label.toLowerCase()] ?? "fas fa-file-alt";
};

// Komponen item menu — support parent (children) dan leaf (NavLink)
const MenuItem = ({ menu, isOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const dropdownRef = React.useRef(null);
  const hasChildren = menu.children && menu.children.length > 0;

  // Tutup popup jika klik di luar elemen saat sidebar minimize dan popup terbuka
  useEffect(() => {
    if (!isOpen && expanded) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setExpanded(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, expanded]);

  // Icon FontAwesome (gunakan menu.icon jika ada, kalau tidak pakai fallback)
  const iconClass = menu.icon || getIconByLabel(menu.label);
  const label = menu.label.charAt(0).toUpperCase() + menu.label.slice(1);

  return (
    <li className="mb-1 relative group" ref={dropdownRef}>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full flex items-center justify-between cursor-pointer px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
              isOpen
                ? "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-purple-600 justify-center"
            }`}
          >
            <div
              className={`flex items-center gap-x-3 ${!isOpen && "justify-center w-full"}`}
            >
              <span className="w-5 flex justify-center shrink-0">
                <i className={`${iconClass} text-[1.1rem]`}></i>
              </span>
              {isOpen && (
                <span className="font-medium whitespace-nowrap">{label}</span>
              )}
            </div>
            {isOpen && (
              <span className="text-xs text-gray-400">
                <i className={`fas fa-chevron-${expanded ? "up" : "down"}`}></i>
              </span>
            )}
          </button>

          {/* Tooltip for collapsed Sidebar parent */}
          {!isOpen && !expanded && (
            <div className="absolute left-full top-0 ml-2 mt-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap z-50">
              {label} (Click to expand)
            </div>
          )}

          {expanded &&
            (isOpen ? (
              <ul className="ml-8 border-l-2 border-gray-100 pl-2 mt-1 space-y-1">
                {menu.children.map((child) => (
                  <MenuItem key={child.id_menu} menu={child} isOpen={isOpen} />
                ))}
              </ul>
            ) : (
              /* Popup Sub-menu for Minimized Sidebar */
              <div className="absolute left-full top-0 ml-2 mt-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                  {label}
                </div>
                <ul className="space-y-1 px-2">
                  {menu.children.map((child) => (
                    /* Pass isOpen=true to child so it renders its label text inside the popup */
                    <MenuItem key={child.id_menu} menu={child} isOpen={true} />
                  ))}
                </ul>
              </div>
            ))}
        </>
      ) : (
        <>
          <NavLink
            to={menu.url ?? `/${menu.label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center gap-x-3 cursor-pointer px-4 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium ${
                isActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#3a0ca3]"
              } ${!isOpen && "justify-center px-0"}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="w-5 flex justify-center shrink-0">
                  <i
                    className={`${iconClass} text-[1.1rem] ${isActive ? "text-white" : "text-gray-400"}`}
                  ></i>
                </span>
                {isOpen && <span className="whitespace-nowrap">{label}</span>}
              </>
            )}
          </NavLink>

          {/* Tooltip for collapsed Sidebar leaf */}
          {!isOpen && (
            <div className="absolute left-full top-0 ml-2 mt-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap z-50">
              {label}
            </div>
          )}
        </>
      )}
    </li>
  );
};

const Sidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const permissions = getStorage("permission");
    if (permissions && Array.isArray(permissions)) {
      setMenuItems(permissions);
    }
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:relative top-0 left-0 z-50 shrink-0 border-r border-gray-200 bg-white transition-all duration-300 h-full flex flex-col ${isMobileOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full md:translate-x-0"} ${isOpen ? "md:w-64" : "md:w-20"}`}
      >
        {/* Brand & Collapse Header */}
        <div className="h-16 flex items-center px-4 md:px-5 relative shrink-0">
          <div
            className={`flex items-center gap-x-3 ${isOpen ? "w-full" : "w-full justify-center"}`}
          >
            <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0 cursor-pointer">
              <span className="text-xl font-bold italic mr-[2px]">K</span>
            </div>
            <h1
              className={`text-gray-900 font-bold text-xl tracking-tight transition-opacity duration-300 whitespace-nowrap ${isMobileOpen || isOpen ? "opacity-100" : "opacity-0 w-0 md:hidden"}`}
            >
              PROKER
            </h1>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-800 focus:outline-none ml-auto shrink-0"
          >
            <i className="fas fa-times text-xl"></i>
          </button>

          {/* Desktop Collapse Toggle (Top Right) */}
          <button
            className={`hidden md:flex absolute right-4 text-gray-400 hover:text-purple-600 focus:outline-none transition-opacity duration-300 border border-gray-200 rounded p-1 hover:bg-gray-50 cursor-pointer ${!isOpen && "opacity-0 pointer-events-none"}`}
            onClick={() => setIsOpen(!isOpen)}
            title="Collapse Sidebar"
          >
            {/* Window layout icon similar to the image */}
            <i className="fas fa-table-columns text-sm transform -scale-x-100"></i>
          </button>
          {/* Desktop Re-expand Toggle (Top Center when collapsed) */}
          <button
            className={`hidden md:flex absolute right-0 left-0 mx-auto w-min text-gray-400 hover:text-purple-600 focus:outline-none transition-opacity duration-300 border border-gray-200 rounded p-1 hover:bg-gray-50 cursor-pointer ${isOpen ? "opacity-0 pointer-events-none hidden" : "opacity-100"}`}
            onClick={() => setIsOpen(!isOpen)}
            title="Expand Sidebar"
            style={{ top: "64px", zIndex: 100 }}
          >
            <i className="fas fa-table-columns text-sm"></i>
          </button>
        </div>

        {/* Menu List */}
        <div
          className={`flex-1 overflow-visible ${isOpen ? "px-3" : "px-2"} pt-8 pb-6`}
        >
          <div className="mb-4 px-3 text-center md:text-left">
            {isMobileOpen || isOpen ? (
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-x-2">
                Dashboard
              </div>
            ) : (
              <div className="border-b-2 border-gray-100 w-6 mx-auto mb-2 relative top-1"></div>
            )}
          </div>

          <ul className="space-y-1 mt-2">
            {menuItems.length === 0 ? (
              <li className="text-gray-400 text-sm px-4 whitespace-nowrap">
                Tidak ada menu
              </li>
            ) : (
              menuItems.map((menu) => (
                <MenuItem
                  key={menu.id_menu}
                  menu={menu}
                  isOpen={isMobileOpen || isOpen}
                />
              ))
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
