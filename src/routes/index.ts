import { useState } from "react";
import { defaultRoutes, errorRoutes } from "./default-routes";
import type { RouteObject } from "react-router-dom";
import { dynamicRoutes } from "./dynamic-routes";

export function useCustomRoutes() {
  // 注册一些默认路由
  const [routes, setRoutes] = useState<RouteObject[]>([
    ...defaultRoutes,
    ...dynamicRoutes,
    ...errorRoutes,
  ]);  

  // 动态添加路由
  const addRoutes = (route: RouteObject[]) => {
    routes.splice(-1, 0, ...route);
    setRoutes(JSON.parse(JSON.stringify(routes)));
  };

  return { routes, addRoutes };
}
