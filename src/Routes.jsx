import { createBrowserRouter } from "react-router";
import LoginPage from "./page/LoginPage";
import Layout from "./components/layout/Layout";
import Dashboard from "./page/Dashboard";

export const Router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "dashboard", element: <Dashboard /> }],
  },
]);
