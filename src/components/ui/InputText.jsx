import React, { useState } from "react";

function InputText({ disabled = true, className, ...props }) {
  if (props.inputOnly == true) {
    return (
      <>
        {disabled ? (
          <div>{props.value}</div>
        ) : (
          <input
            type="text"
            name={props.name}
            className="h-[40px] col-span-2 border border-gray-300 rounded-md focus:border-gray-400 focus:outline focus:outline-gray-400 p-1"
            onChange={(e) => {
              props.onChange(e.target.value);
            }}
          />
        )}
      </>
    );
  }
  return (
    <>
      <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 md:text-left">
        <div
          className={`${
            props.inputCol ? "col-span-2 mb-1" : "md:text-right"
          }  font-semibold text-[#333] `}
        >
          {props.name}
        </div>
        <input
          type={props.type}
          name={props.name}
          className={`${
            props.inputCol ? "col-span-3" : ""
          } h-[40px]  col-span-2 border border-gray-300 rounded-md focus:border-gray-400 focus:outline focus:outline-gray-400 p-1`}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          placeholder={props.placeholder}
        />
      </div>
    </>
  );
}

export default InputText;
