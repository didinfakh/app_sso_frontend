import { createBrowserRouter } from "react-router";
import LoginPage from "./page/LoginPage";
import Layout from "./components/layout/Layout";
import Dashboard from "./page/Dashboard";
import LayoutLogin from "./components/layout/LayoutLogin";
import RegisterPage from "./page/RegisterPage";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutLogin />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "dashboard", element: <Dashboard /> }],
  },
]);
