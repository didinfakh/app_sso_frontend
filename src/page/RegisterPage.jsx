import React, { use, useContext, useEffect, useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/ui/InputText";
import { ApiAuth } from "../services/ApiAuth";
import { Link, useLocation, useNavigate } from "react-router";
import BtnLogin from "../components/ui/BtnSubmit";
import { getStorage } from "../services/Utils";
import { UserContext } from "../App";
import { useToast } from "../context/ToastContext";
export default function RegisterPage() {
  const { user, setuser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [error, seterror] = useState([]);
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const { showToast } = useToast();
  const Navigate = useNavigate();
  const location = useLocation();
  const submitForm = async () => {
    setIsLoading(true);
    try {
      const data = {
        email,
        password,
        name,
        password_confirmation: confirmpassword,
      };
      const response = await ApiAuth.register(data);
      if (response && response.errors) {
        seterror(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Registrasi gagal", "error");
      } else if (response) {
        setuser({ email: response.email, name: response.name });
        showToast(
          "Registrasi berhasil. Silakan verifikasi email Anda.",
          "success",
        );
        Navigate("/verify-notice");
      } else {
        showToast("Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-full md:w-1/2 min-h-screen px-10 md:px-28 py-10">
        <div className="w-full mb-12">
          <div className="text-4xl font-bold text-gray-900 tracking-tight">
            PROKER
          </div>
        </div>
        <div className="my-auto ">
          <p className="text-purple-600 mb-1 inline-block font-semibold ">
            Register an account
          </p>
          <h1 className="text-4xl font-bold mb-8 text-black">CREATE ACCOUNT</h1>

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
              onChange={setname}
              value={name}
              type={"text"}
              inputCol
              error={error}
              // inputOnly={true}
              disabled={false}
              name="name"
              placeholder="Nama"
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
            <InputText
              onChange={setconfirmpassword}
              value={confirmpassword}
              type={"password"}
              inputCol
              error={error}
              // inputOnly={true}
              disabled={false}
              name="confirmpassword"
              placeholder="Confirm Password"
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
            Already have an account?{" "}
            <Link
              // href="#"
              to={"/login"}
              className="text-[#8891FF]  hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
