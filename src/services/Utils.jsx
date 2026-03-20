import { useNavigate } from "react-router";

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};

export const hasAccess = (currentPath, action) => {
  const permissions = getStorage("permission");
  if (!permissions || !Array.isArray(permissions)) return false;

  const findMenuByUrl = (menus, url) => {
    for (let menu of menus) {
      if (menu.url === url) return menu;
      if (menu.children && menu.children.length > 0) {
        const found = findMenuByUrl(menu.children, url);
        if (found) return found;
      }
    }
    return null;
  };

  const currentMenu = findMenuByUrl(permissions, currentPath);
  if (!currentMenu) return false; // Akses ditolak jika menu tidak ditemukan

  return currentMenu.actions && currentMenu.actions.includes(action);
};
// export const useRouter = () => {
//   const push = useNavigate();
//   return { push };
// };
