import React from "react";

function BtnLogin({ onClick, placeholder, ...props }) {
  return (
    <div>
      <button
        onClick={onClick}
        // type="submit"
        className={`w-full rounded-2xl ${
          props.isLoading
            ? "bg-[#7480ff] cursor-not-allowed"
            : "bg-[#8891FF] cursor-pointer"
        } py-3 text-white font-semibold text-lg hover:bg-[#7480ff] transition `}
      >
        {props.isLoading ? "loading...." : placeholder}
      </button>
    </div>
  );
}

export default BtnLogin;
