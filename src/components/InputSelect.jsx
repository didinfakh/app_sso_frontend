import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

function InputSelect(props) {
  const [valueSelected, setValueSelected] = useState(props.isMulti ? [] : {});
  let arrValueSelected = [];
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      renderValue();
    } else {
      renderValue();
    }
  }, [props.value]);

  const renderValue = () => {
    for (let i = 0; i < props.data.length; i++) {
      if (props.isMulti) {
        if (Array.isArray(props.value) && props.value.length > 0) {
          const initialSelections = props.data.filter((option) =>
            props.value.includes(option.value)
          );
          setValueSelected(initialSelections);
        } else {
          setValueSelected([]);
        }
      } else if (props.data[i].value == props.value) {
        arrValueSelected = props.data[i];
        setValueSelected(arrValueSelected);
      }
    }
  };

  return (
    <>
      <h1>ini adalah select</h1>
      <Select
        value={valueSelected}
        options={props.data}
        isMulti
        onChange={(e) => {
          console.log("Selected Options:", e);
          if (props.isMulti) {
            let arrVal = [];
            e.map((index, value) => {
              arrVal.push(index.value);
            });
            props.onChange(arrVal);
          }
          // props.onChange(e.value);
        }}
      />

      {/* <Select options={data} isMulti onChange={(e) => console.log(e)} /> */}
    </>
  );
}

export default InputSelect;
