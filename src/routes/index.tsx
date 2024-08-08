import { createBrowserRouter } from "react-router-dom";
// import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import type { Router } from "@remix-run/router";

import LoginForm from "@/pages/login/login";
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Danmu from "@/pages/event/danmu/Danmu";
import VideoPlayer from "@/pages/event/video-player/VideoPlayer";
import Table from "@/pages/event/table/Table";
import TableFrontend from "@/pages/event/table-frontend/TableFrontend";
import User from "@/pages/system/user/User";
import Role from "@/pages/system/role/Role";
import Menu from "@/pages/system/menu/Menu";
import Home from "@/pages/home/Home";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <LoginForm /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        index: true,
        element: <Dashboard />,
        loader: () => {
          return new Promise((resolve) => {
            resolve("dashboard");
          });
        },
      },
      {
        path: "/event/danmu",
        element: <Danmu />,
      },
      {
        path: "/event/video-player",
        element: <VideoPlayer />,
      },
      {
        path: "/event/table",
        element: <Table />,
      },
      {
        path: "/event/table-frontend",
        element: <TableFrontend />,
      },
      {
        path: "/system/user",
        element: <User />,
      },
      {
        path: "/system/role",
        element: <Role />,
      },
      {
        path: "/system/menu",
        element: <Menu />,
      },
    ],
  },
  // ...其他需要守卫的路由
];

export const router: Router = createBrowserRouter(routes);
