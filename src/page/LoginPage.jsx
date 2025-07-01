import React from "react";
import bgLogin from "../assets/bgLogin.png";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="relative hidden md:flex w-1/2 bg-[#0b0b0b] rounded-3xl overflow-hidden items-center justify-center  m-1">
        {/* Decorative black 3d ring shapes */}
        <img src={bgLogin} alt="" className="h-[99vh]" />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-20">
        <div className="max-w-md w-full mx-auto">
          <div className="text-sm font-bold mb-3 text-gray-900">EDUMENTOR</div>
          <a
            href="#"
            className="text-indigo-600 text-sm mb-1 inline-block font-semibold hover:underline"
          >
            Create an Account
          </a>
          <h1 className="text-3xl font-extrabold mb-8 text-black">
            WELCOME TO <br /> BYTESPACE
          </h1>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Jamie Davis"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="designer@example.com"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

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
