import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider } from "react-router";
import { Router } from "./Routes";
import { ToastProvider } from "./context/ToastContext";

export const UserContext = createContext();
function App() {
  const [user, setuser] = useState("test");

  return (
    <ToastProvider>
      <UserContext.Provider value={{ user, setuser }}>
        <RouterProvider router={Router} />
      </UserContext.Provider>
    </ToastProvider>
  );
}

export default App;
