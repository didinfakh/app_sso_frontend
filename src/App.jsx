import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import InputText from "./components/InputText";

function App() {
  const [count, setCount] = useState("");

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
      </div>
    </>
  );
}

export default App;
