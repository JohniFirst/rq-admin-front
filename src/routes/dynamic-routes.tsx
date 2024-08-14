// import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import Layout from "@/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Table from "@/pages/event/table/Table";
import TableFrontend from "@/pages/event/table-frontend/TableFrontend";
import User from "@/pages/system/user/User";
import Role from "@/pages/system/role/Role";
import Menu from "@/pages/system/menu/Menu";
import CopyToClipboard from "@/pages/event/clipboard/copy-to-clipboard";
import Danmu from "@/pages/event-pro/danmu/Danmu";
import VideoPlayer from "@/pages/event-pro/video-player/video-player";
import PictureStitching from "@/pages/event-pro/picture-stitching/picture-stitching";
import ShareAnimation from "@/pages/event-pro/animate/share-animation/share-animation";
import ShareAnimationDetail from "@/pages/event-pro/animate/share-animation-detail/share-animation-detail";

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
        path: "/event-pro",
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
            path: "picture-stitching",
            element: <PictureStitching />,
            // lazy: () => import("@/pages/event-pro/picture-stitching/picture-stitching").then((module) => ({
            //   element: <module.default />,
            // })),
          },
          {
            path: "animate",
            children: [
              {
                path: "share-animation",
                element: <ShareAnimation />,
              },
              {
                path: "share-animation-detail",
                element: <ShareAnimationDetail />,
              },
            ],
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
