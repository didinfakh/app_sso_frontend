import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./page/LoginPage";
import Layout from "./components/layout/Layout";
import Dashboard from "./page/Dashboard";
import LayoutLogin from "./components/layout/LayoutLogin";
import RegisterPage from "./page/RegisterPage";
import VerifyNotice from "./page/VerifyNotice";
import MenuPage from "./page/MenuPage";
import SysGroupPermissions from "./page/SysGroupPermissions";
// import { Navigate } from "react-router-dom";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutLogin />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-notice", element: <VerifyNotice /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "menu", element: <MenuPage /> },
      { path: "sys-group-permissions", element: <SysGroupPermissions /> },
    ],
  },
]);
