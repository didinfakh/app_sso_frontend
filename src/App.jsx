import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import InputText from "./components/InputText";
import InputSelect from "./components/InputSelect";
const data = [
  { value: "1", label: "Chocolate" },
  { value: "2", label: "Strawberry" },
  { value: "3", label: "Vanilla" },
];
function App() {
  const [count, setCount] = useState("");
  const [valueSelect, setValueSelect] = useState("2");
  console.log(valueSelect);
  return (
    <>
      {count}
      <div className="h-12"></div>
      <div className="w-[50vw] ms-4">
        <InputText
          onChange={setCount}
          value={count}
          type={"date"}
          // inputCol
          // inputOnly={true}
          disabled={false}
          name="Tanggal lahir"
          placeholder="Tanggal lahir"
        />
        <InputSelect
          data={data}
          value={valueSelect}
          onChange={setValueSelect}
        />
      </div>
    </>
  );
}

export default App;
