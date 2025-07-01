import React, { useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/InputText";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="relative hidden md:flex w-1/2 bg-[#0b0b0b] rounded-3xl overflow-hidden items-center justify-center  m-1">
        {/* Decorative black 3d ring shapes */}
        <img src={bgLogin} alt="" className="h-[99vh]" />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 h-100vh my-10 mx-14">
        <div className=" w-full ">
          <div className="text-5xl font-bold  text-gray-900 mb-10">
            EDUMENTOR
          </div>
        </div>
        <div className="my-auto ">
          <a
            href="#"
            className="text-indigo-600 text-xl mb-1 inline-block font-semibold hover:underline"
          >
            Create an Account
          </a>
          <h1 className="text-5xl font-extrabold mb-8 text-black">
            WELCOME TO AXIOS APP
          </h1>

          <form className="space-y-6">
            <InputText
              onChange={setUsername}
              value={username}
              type={"text"}
              inputCol
              // inputOnly={true}
              disabled={false}
              name="Username"
              placeholder="Username"
            />
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

            <div>
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-3 text-white font-semibold text-lg hover:bg-indigo-700 transition"
              >
                Continue
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-400 mt-8 text-center">
            Already have an account?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
