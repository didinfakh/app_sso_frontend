import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider } from "react-router";
import { Router } from "./Routes";
export const UserContext = createContext();
function App() {
  const [user, setuser] = useState("test");

  return (
    <>
      <UserContext.Provider value={{ user, setuser }}>
        <RouterProvider router={Router} />
      </UserContext.Provider>
    </>
  );
}

export default App;
