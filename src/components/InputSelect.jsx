import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";

function InputSelect(props) {
  const selectedValue = useMemo(() => {
    if (props.isMulti) {
      return Array.isArray(props.value)
        ? props.data.filter((opt) => props.value.includes(opt.value))
        : [];
    }
    return props.data.find((opt) => opt.value === props.value) || null;
  }, [props.data, props.value, props.isMulti]);

  const handleChange = (selectedOption) => {
    if (props.isMulti) {
      const values = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
      props.onChange(values);
    } else {
      props.onChange(selectedOption ? selectedOption.value : null);
    }
  };
  if (props.inputOnly == true) {
    return (
      <>
        <Select
          value={selectedValue}
          options={props.data}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          onChange={onchange}
        />
      </>
    );
  }
  return (
    <>
      <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 md:text-left">
        <div
          className={`${
            props.inputCol ? "col-span-3 mb-1" : "md:text-right"
          }  font-semibold text-[#333] `}
        >
          {props.name}
        </div>
        <Select
          className="col-span-2"
          value={selectedValue}
          options={props.data}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          onChange={handleChange}
          // onChange={(e) => {
          // console.log("Selected Options:", e);
          // if (props.isMulti) {
          //   let arrVal = [];
          //   e.map((index, value) => {
          //     arrVal.push(index.value);
          //   });
          //   props.onChange(arrVal);
          // }
          // props.onChange(e.value);
          // }}
        />
      </div>

      {/* <Select options={data} isMulti onChange={(e) => console.log(e)} /> */}
    </>
  );
}

export default InputSelect;
