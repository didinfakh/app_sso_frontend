import React, { useContext, useEffect, useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/ui/InputText";
import { ApiAuth } from "../services/ApiAuth";
import { Link, useLocation, useNavigate } from "react-router";
import BtnLogin from "../components/ui/BtnSubmit";
import { getStorage } from "../services/Utils";
import { UserContext } from "../App";
import { useToast } from "../context/ToastContext";
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [error, seterror] = useState([]);
  const [password, setpassword] = useState("");
  const { showToast } = useToast();

  const { user, setuser } = useContext(UserContext);
  useEffect(() => {
    setuser({ email: "test@gmail" });
    // console.log(user);
  }, []);

  const Navigate = useNavigate();
  const location = useLocation();
  const submitForm = async () => {
    setIsLoading(true);
    try {
      const data = {
        email,
        password,
      };
      const response = await ApiAuth.login(data);
      if (response && response.errors) {
        seterror(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Login gagal", "error");
      } else if (response) {
        showToast("Login berhasil", "success");
        Navigate("/dashboard");
      } else {
        showToast("Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (getStorage("isLogedIn")) {
      Navigate("/dashboard");
    }
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-col justify-center w-full md:w-1/2 min-h-screen px-10 md:px-28 py-10">
        <div className="w-full mb-12">
          <div className="text-4xl font-bold text-gray-900 tracking-tight">
            ViProk
          </div>
        </div>
        <div className="my-auto ">
          <p className="text-purple-600 mb-1 inline-block font-semibold  ">
            Login to your account
          </p>
          <h1 className="text-4xl font-bold mb-8 text-black ">WELCOME BACK</h1>

          <form className="space-y-6">
            <InputText
              onChange={setemail}
              value={email}
              type={"text"}
              inputCol
              error={error}
              // inputOnly={true}
              disabled={false}
              name="email"
              placeholder="Email"
            />
            <InputText
              onChange={setpassword}
              value={password}
              type={"password"}
              inputCol
              error={error}
              // inputOnly={true}
              disabled={false}
              name="password"
              placeholder="Password"
            />
          </form>
          <div className="mt-10">
            <BtnLogin
              onClick={submitForm}
              isLoading={isLoading}
              placeholder={"Continue"}
            />
          </div>

          <p className=" text-gray-400 mt-8 text-center">
            Dont have an account?{" "}
            <Link
              to={"/register"}
              className="text-purple-600 hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
