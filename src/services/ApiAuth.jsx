import axios from "axios";
import Axios from "axios";
import { getStorage, removeStorage, setStorage } from "./Utils";
import { Navigate } from "react-router";

// const router = useRouter();
export const apiconfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
apiconfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
const csrfToken = () =>
  axios.get(import.meta.env.VITE_API_URL + "/sanctum/csrf-cookie", {
    withCredentials: true,
  });

export const ApiAuth = {
  login: async (props) => {
    try {
      await csrfToken();
      const res = await apiconfig.post("/login", props);

      // Logika sukses
      console.log(res.data.permission);
      setStorage("isLogedIn", true);
      setStorage("user", res.data.user);
      setStorage("permission", res.data.permission);
      localStorage.setItem("token", res.data.access_token);

      // Kembalikan data yang berhasil didapat
      return res.data;
    } catch (error) {
      console.log("ini response dari api");
      console.log(error.response);
      if (error.response && error.response.data) return error.response.data;
    }
  },
  logout: async (props) => {
    const response = await apiconfig.post("/logout", props);
    if (response.status !== 200) {
      removeStorage("isLogedIn");
      removeStorage("user");
      router.push("/login");
    }
  },
  register: async (props) => {
    try {
      await csrfToken();
      const res = await apiconfig.post("/register", props);

      // Logika sukses
      // setStorage("isLogedIn", true);
      // setStorage("user", res.data.user);

      // Kembalikan data yang berhasil didapat
      return res.data;
    } catch (error) {
      console.log("ini response dari api");
      console.log(error.response);
      if (error.response && error.response.data) return error.response.data;
    }
  },

  resend_verification: async (props) => {
    try {
      const response = await apiconfig.post("/resend-verification");
      return response.data;
    } catch (error) {
      console.error("Error sending verification email:", error);
      if (error.response && error.response.data) return error.response.data;
    }
  },
};
