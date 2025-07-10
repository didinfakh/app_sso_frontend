import React, { use, useEffect, useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/ui/InputText";
import { ApiAuth } from "../services/ApiAuth";
import { useLocation, useNavigate } from "react-router";
import BtnLogin from "../components/ui/BtnSubmit";
import { getStorage } from "../services/Utils";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [error, seterror] = useState([]);
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const Navigate = useNavigate();
  const location = useLocation();
  const submitForm = async () => {
    setIsLoading(true);
    const data = {
      email,
      password,
      username,
      confirmpassword,
    };
    const response = await ApiAuth.register(data);
    if (response.errors) {
      seterror(response.errors);
    }
    setIsLoading(false);
    // Navigate("/dashboard");
  };

  useEffect(() => {
    console.log("test");
    console.log(email);
    console.log(username);
  }, [email]);
  return (
    <>
      <div className="flex flex-col justify-center w-full md:w-1/2 h-100vh my-10 px-10 md:px-28">
        <div className=" w-full ">
          <div className="text-5xl font-bold  text-gray-900 mb-10">
            EDUMENTOR
          </div>
        </div>
        <div className="my-auto ">
          <p className="text-[#8891FF]   mb-1 inline-block font-semibold ">
            Register an account
          </p>
          <h1 className="text-5xl font-extrabold mb-8 text-black">
            WELCOME TO AXIOS APP
          </h1>

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
              onChange={setusername}
              value={username}
              type={"text"}
              inputCol
              error={error}
              // inputOnly={true}
              disabled={false}
              name="username"
              placeholder="Username"
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
            <a
              href="#"
              className="text-[#8891FF]  hover:underline font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
