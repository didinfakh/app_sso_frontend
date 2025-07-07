import React, { useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/InputText";
import { ApiAuth } from "../services/ApiAuth";
import { useNavigate } from "react-router";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const Navigate = useNavigate();
  const submitLogin = async () => {
    const data = {
      email,
      password,
    };
    const response = await ApiAuth.login(data);
    // console.log(response);
    if (response) {
      Navigate("/dashboard");
    }
  };
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden md:flex w-1/2 bg-[#0b0b0b] rounded-3xl overflow-hidden items-center justify-center  m-1">
        <img src={bgLogin} alt="" className="h-[99vh]" />
      </div>

      <div className="flex flex-col justify-center w-full md:w-1/2 h-100vh my-10 px-10 md:px-28">
        <div className=" w-full ">
          <div className="text-5xl font-bold  text-gray-900 mb-10">
            EDUMENTOR
          </div>
        </div>
        <div className="my-auto ">
          <p className="text-[#8891FF]   mb-1 inline-block font-semibold ">
            Create an Account
          </p>
          <h1 className="text-5xl font-extrabold mb-8 text-black">
            WELCOME TO AXIOS APP
          </h1>

          <form className="space-y-6">
            {/* <InputText
              onChange={setUsername}
              value={username}
              type={"text"}
              inputCol
              // inputOnly={true}
              disabled={false}
              name="Username"
              placeholder="Username"
            /> */}
            <InputText
              onChange={setemail}
              value={email}
              type={"text"}
              inputCol
              // inputOnly={true}
              disabled={false}
              name="Email"
              placeholder="Email"
            />
            <InputText
              onChange={setpassword}
              value={password}
              type={"password"}
              inputCol
              // inputOnly={true}
              disabled={false}
              name="Password"
              placeholder="Password"
            />
          </form>
          <div className="mt-10">
            <button
              onClick={submitLogin}
              // type="submit"
              className="w-full rounded-2xl bg-[#8891FF] py-3 text-white font-semibold text-lg hover:bg-[#7480ff] transition cursor-pointer"
            >
              Continue
            </button>
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
    </div>
  );
}
