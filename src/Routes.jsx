import { createBrowserRouter } from "react-router";
import LoginPage from "./page/LoginPage";

export const Router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
]);
