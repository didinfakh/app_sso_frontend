import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getStorage } from "../../services/Utils";

// Fallback icon berdasarkan label menu
const getIconByLabel = (label = "") => {
  const map = {
    dashboard: "🏠",
    master: "🗂️",
    users: "👥",
    user: "👤",
    role: "🔑",
    roles: "🔑",
    proker: "📋",
    laporan: "📊",
    report: "📊",
    divisi: "🏢",
    anggaran: "💰",
    settings: "⚙️",
    menu: "📂",
  };
  return map[label.toLowerCase()] ?? "📄";
};

// Komponen item menu — support parent (children) dan leaf (NavLink)
const MenuItem = ({ menu, isOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = menu.children && menu.children.length > 0;
  const icon = menu.icon ?? getIconByLabel(menu.label);
  const label = menu.label.charAt(0).toUpperCase() + menu.label.slice(1);

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 text-sm text-gray-300 hover:bg-slate-800 transition-colors duration-150"
          >
            <span className="w-6 h-6 flex items-center justify-center shrink-0 text-base">
              {icon}
            </span>
            {isOpen && (
              <>
                <span className="flex-1 text-left whitespace-nowrap">
                  {label}
                </span>
                <span className="text-xs text-gray-500">
                  {expanded ? "▾" : "▸"}
                </span>
              </>
            )}
          </button>

          {expanded && isOpen && (
            <ul className="ml-8 border-l border-slate-700 pl-2">
              {menu.children.map((child) => (
                <MenuItem key={child.id_menu} menu={child} isOpen={isOpen} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink
          to={menu.url ?? `/${menu.label.toLowerCase()}`}
          className={({ isActive }) =>
            `flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 text-sm transition-colors duration-150 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-800"
            }`
          }
        >
          <span className="w-6 h-6 flex items-center justify-center shrink-0 text-base">
            {icon}
          </span>
          {isOpen && <span className="whitespace-nowrap">{label}</span>}
        </NavLink>
      )}
    </li>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const permissions = getStorage("permission");
    if (permissions && Array.isArray(permissions)) {
      setMenuItems(permissions);
    }
  }, []);

  return (
    <div>
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-slate-900 h-screen p-4 pt-8 duration-300 relative flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          className="absolute right-1 top-9 bg-white border-2 border-slate-900 rounded-full w-7 h-7 flex items-center justify-center text-xs"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Brand */}
        <div className={`${isOpen ? "flex" : "hidden"} gap-x-4 items-center`}>
          <div className="bg-blue-500 h-8 w-8 rounded-md shrink-0 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <h1
            className={`text-white origin-left font-medium text-xl duration-300 ${
              !isOpen && "scale-0"
            }`}
          >
            ManProk
          </h1>
        </div>

        {/* Menu List */}
        <ul className="pt-6 flex-1 overflow-y-auto">
          {menuItems.length === 0 ? (
            <li className="text-gray-500 text-xs px-2">Tidak ada menu</li>
          ) : (
            menuItems.map((menu) => (
              <MenuItem key={menu.id_menu} menu={menu} isOpen={isOpen} />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
