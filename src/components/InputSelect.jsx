import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

const data = [
  { value: "1", label: "Chocolate" },
  { value: "2", label: "Strawberry" },
  { value: "3", label: "Vanilla" },
];
function InputSelect(props) {
  const [valueSelected, setValueSelected] = useState({});

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      renderValue();
    } else {
      if (props.value != valueSelected.value) renderValue();
    }
  });

  const renderValue = () => {
    for (let i = 0; i < props.data.length; i++) {
      if (props.data[i].value == props.value) {
        setValueSelected(props.data[i]);
      }
    }
  };

  return (
    <>
      <h1>ini adalah select</h1>
      <Select
        value={valueSelected}
        options={data}
        onChange={(e) => {
          props.onChange(e.value);
        }}
      />
    </>
  );
}

export default InputSelect;
