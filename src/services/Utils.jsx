import { useNavigate } from "react-router";

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
// export const useRouter = () => {
//   const push = useNavigate();
//   return { push };
// };
