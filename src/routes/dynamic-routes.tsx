import type { RouteObject } from "react-router-dom";

import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Danmu from "@/pages/event/danmu/Danmu";
import VideoPlayer from "@/pages/event/video-player/VideoPlayer";
import Table from "@/pages/event/table/Table";
import TableFrontend from "@/pages/event/table-frontend/TableFrontend";
import User from "@/pages/system/user/User";
import Role from "@/pages/system/role/Role";
import Menu from "@/pages/system/menu/Menu";
import CopyToClipboard from "@/pages/event/clipboard/CopyToClipboard";

export const dynamicRoutes: RouteObject[] = [
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
        path: "/event",
        children: [
          {
            path: "danmu",
            element: <Danmu />,
          },
          {
            path: "video-player",
            element: <VideoPlayer />,
          },
          {
            path: "table",
            element: <Table />,
          },
          {
            path: "table-frontend",
            element: <TableFrontend />,
          },
          {
            path: "copy-to-clipboard",
            element: <CopyToClipboard />,
          },
        ],
      },
      {
        path: "/system",
        children: [
          {
            path: "user",
            element: <User />,
          },
          {
            path: "role",
            element: <Role />,
          },
          {
            path: "menu",
            element: <Menu />,
          },
        ],
      },
    ],
  },
];
