import type { RouteObject } from "react-router-dom";

import LoginForm from "@/pages/login/login";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/NotFound/NotFound";

// 默认路由
export const defaultRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginForm /> },
];

// 默认出错路由
export const errorRoutes: RouteObject[] = [
  { path: "/*", element: <NotFound /> },
];
