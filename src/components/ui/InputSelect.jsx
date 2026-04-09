import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";

function InputSelect({ error, label, ...props }) {
  const displayLabel = label || props.name;
  const selectedValue = useMemo(() => {
    if (props.isMulti) {
      return Array.isArray(props.value)
        ? props.data.filter((opt) => props.value.includes(opt.value))
        : [];
    }
    return props.data.find((opt) => opt.value === props.value) || null;
  }, [props.data, props.value, props.isMulti]);

  const handleChange = (selectedOption) => {
    if (error && error[props.name]) error[props.name] = null;
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
          className={`${
            error && error[props.name] ? "border-red-500" : "border-gray-300"
          }`}
          value={selectedValue}
          options={props.data}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          onChange={handleChange}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
        <small className=" text-red-500 h-1">
          {error && error[props.name] ? error[props.name] : " "}
        </small>
      </>
    );
  }
  return (
    <>
      <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 md:text-left">
        <div
          className={`${props.inputCol ? "col-span-3 mb-1" : "md:text-right"} ${
            error && error[props.name] ? "text-red-500" : "text-[#333]"
          }  font-semibold  `}
        >
          {displayLabel}
        </div>
        <Select
          className={` col-span-2 ${
            error && error[props.name] ? "border-red-500" : "border-gray-300"
          }`}
          value={selectedValue}
          options={props.data}
          isMulti={props.isMulti}
          isClearable={props.isClearable}
          isDisabled={props.disabled}
          onChange={handleChange}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
        <small className="col-span-3 text-red-500 h-1">
          {error && error[props.name] ? error[props.name] : " "}
        </small>
      </div>
    </>
  );
}

export default InputSelect;
