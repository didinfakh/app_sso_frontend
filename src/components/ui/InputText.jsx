import React, { useState } from "react";

function InputText({ disabled = true, className, error = null, ...props }) {
  if (props.inputOnly == true) {
    return (
      <>
        {disabled ? (
          <div>{props.value}</div>
        ) : (
          <>
            <input
              type="text"
              name={props.name}
              className={`h-[40px] col-span-2 border ${
                error && error[props.name]
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:border-gray-400 focus:outline focus:outline-gray-400 p-1`}
              onChange={(e) => {
                error[props.name] = null;
                props.onChange(e.target.value);
              }}
            />
            <small className="col-span-3 text-red-500 h-1">
              {error && error[props.name] ? error[props.name] : " "}
            </small>
          </>
        )}
      </>
    );
  }
  return (
    <>
      <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 md:text-left">
        <div
          className={`${props.inputCol ? "col-span-2 mb-1" : "md:text-right"} ${
            error && error[props.name] ? "text-red-500" : "text-[#333]"
          } font-semibold  `}
        >
          {props.placeholder}
        </div>
        <input
          type={props.type}
          name={props.name}
          className={`${
            props.inputCol ? "col-span-3" : ""
          } h-[40px]  col-span-2 border ${
            error && error[props.name] ? "border-red-500" : "border-gray-300"
          } rounded-md focus:border-gray-400 focus:outline focus:outline-gray-400 p-1`}
          onChange={(e) => {
            // e.preventDefault();
            error[props.name] = null;
            props.onChange(e.target.value);
          }}
          placeholder={props.placeholder}
        />
        <small className="col-span-3 text-red-500 h-1">
          {error && error[props.name] ? error[props.name] : " "}
        </small>
      </div>
    </>
  );
}

export default InputText;
