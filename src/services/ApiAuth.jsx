import axios from "axios";
import Axios from "axios";
import { getStorage, setStorage } from "./Utils";
import { Navigate } from "react-router";

// const router = useRouter();
const apiconfig = Axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});
const csrfToken = () =>
  axios.get(import.meta.env.VITE_API_URL + "/sanctum/csrf-cookie", {
    withCredentials: true,
  });

export const ApiAuth = {
  login: async (props) => {
    await csrfToken();
    const response = await apiconfig.post("/login", props);
    setStorage("isLogedIn", true);
    setStorage("user", response.data.user);
    return response.data.user;
  },
};
