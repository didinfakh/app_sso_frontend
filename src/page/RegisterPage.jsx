import React, { use, useContext, useEffect, useState } from "react";
import bgLogin from "../assets/bgLogin.png";
import InputText from "../components/ui/InputText";
import { ApiAuth } from "../services/ApiAuth";
import { Link, useLocation, useNavigate } from "react-router";
import BtnLogin from "../components/ui/BtnSubmit";
import { getStorage } from "../services/Utils";
import { UserContext } from "../App";
export default function RegisterPage() {
  const { user, setuser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [error, seterror] = useState([]);
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const Navigate = useNavigate();
  const location = useLocation();
  const submitForm = async () => {
    setIsLoading(true);
    const data = {
      email,
      password,
      name,
      password_confirmation: confirmpassword,
    };
    const response = await ApiAuth.register(data);
    setIsLoading(false);
    if (response.errors) {
      seterror(response.errors);
      return;
    }
    console.log("ini adalah response");
    console.log(response);
    setuser({ email: response.email, name: response.name });
    Navigate("/verify-notice");
  };

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
