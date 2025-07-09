import axios from "axios";
import Axios from "axios";
import { getStorage, removeStorage, setStorage } from "./Utils";
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
    // apiconfig
    //   .post("/login", props)
    //   .then((res) => {
    //     // console.log(res);
    //     setStorage("isLogedIn", true);
    //     setStorage("user", res.data.user);
    //     return res.data;
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     return err;
    //   });
    try {
      await csrfToken();
      const res = await apiconfig.post("/login", props);

      // Logika sukses
      setStorage("isLogedIn", true);
      setStorage("user", res.data.user);

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
};
