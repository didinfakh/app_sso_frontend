import React, { use, useContext, useEffect, useState } from "react";

import { Link } from "react-router";
import BtnLogin from "../components/ui/BtnSubmit";
import { UserContext } from "../App";
import { ApiAuth } from "../services/ApiAuth";
function VerifyNotice() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setuser } = useContext(UserContext);

  const sendEmail = async () => {
    setIsLoading(true);
    // Simulate an API call to resend verification email
    const response = await ApiAuth.resend_verification();
    setIsLoading(false);
    if (response.errors) {
      alert("Error resending verification email:", response.errors);
      return;
    }
    alert("Verification email sent successfully!");
  };

  return (
    <div className="flex flex-col justify-center w-full md:w-1/2 h-100vh my-10 px-10 md:px-28">
      <div className=" w-full ">
        <div className="text-5xl font-bold  text-gray-900 mb-10">EDUMENTOR</div>
      </div>
      <div className="my-auto ">
        <p className="text-[#8891FF]   mb-1 inline-block font-semibold ">
          Verify an account
        </p>
        <h1 className="text-5xl font-extrabold mb-8 text-black">
          WELCOME TO AXIOS APP
        </h1>

        <div className="space-y-6">
          <h1>
            We've sent a verification email to [your email]. Please open your
            inbox and follow the instructions in the email to verify your
            account.
            <br />
            <br />
            If you don't see our email, check your spam or junk folder, or click
            the button below to resend the verification email.
          </h1>
        </div>
        <div className="mt-10">
          <BtnLogin
            onClick={sendEmail}
            isLoading={isLoading}
            placeholder={"Resend Verification Email"}
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyNotice;
