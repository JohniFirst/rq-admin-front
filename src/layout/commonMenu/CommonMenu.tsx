import { Menu } from "antd";
import HeaderOperate from "../components/headerOperate";
import NavigationBar from "../components/navigationBar/NavigationBar";
import { Outlet, useLocation } from "react-router-dom";
import {
  CodeOutlined,
  FieldStringOutlined,
  HomeFilled,
  MehOutlined,
  MenuOutlined,
  TableOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "@/store/hooks";
import { pushNavItemAction } from "@/store/systemInfo";
import useCustomNavigate from "@/hooks/useCustomNavigate";

import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useCustomRoutes } from "@/routes";
import { dynamicRoutes } from "@/routes/dynamic-routes";
export type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/dashboard",
    label: "主页",
    title: "主页",
    icon: <HomeFilled />,
  },
  {
    key: "/event",
    label: "业务组件",
    icon: <MehOutlined />,
    children: [
      {
        key: "/event/danmu",
        label: "弹幕",
        title: "弹幕",
        icon: <CodeOutlined />,
      },
      {
        key: "/event/video-player",
        label: "视频播放器",
        title: "视频播放器",
        icon: <VideoCameraOutlined />,
      },
      {
        key: "/event/table",
        label: "表格分页",
        title: "表格分页",
        icon: <TableOutlined />,
      },
      {
        key: "/event/table-frontend",
        label: "前端表格分页",
        title: "前端表格分页",
        icon: <FieldStringOutlined />,
      },
      {
        key: "/event/copy-to-clipboard",
        label: "复制到剪切板",
        title: "复制到剪切板",
        icon: <FieldStringOutlined />,
      },
    ],
  },
  {
    key: "/system",
    label: "系统管理",
    icon: <ToolOutlined />,
    children: [
      {
        key: "/system/user",
        label: "用户管理",
        title: "用户管理",
        icon: <UserOutlined />,
      },
      {
        key: "/system/role",
        label: "角色管理",
        title: "角色管理",
        icon: <UsergroupAddOutlined />,
      },
      {
        key: "/system/menu",
        label: "菜单管理",
        title: "菜单管理",
        icon: <MenuOutlined />,
      },
    ],
  },
];

function CommonMenu() {
  const navigate = useCustomNavigate();
  const dispatch = useAppDispatch();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);

    dispatch(
      pushNavItemAction({
        key: e.key,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        label: e.item.props.title,
        active: true,
        fixed: false,
      })
    );
  };

  const location = useLocation();

  // 找到当前选中项和需要展开的项
  const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
    let selectedKey = "";
    const openKeys: string[] = [];

    const findKeys = (items: MenuItem[]) => {
      items.forEach((item: MenuItem) => {
        if (item && Object.keys(item).includes("children")) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const children = item.children;
          if (
            Array.isArray(children) &&
            children.some((child: { key: string }) => child.key === currentPath)
          ) {
            selectedKey = currentPath;
            openKeys.push(item.key as string);
          }
          findKeys(children);
        } else if (item?.key === currentPath) {
          selectedKey = currentPath;
        }
      });
    };

    findKeys(items);
    return { selectedKey, openKeys };
  };

  const [selectedKey, setSelectedKey] = useState([""]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const result = findSelectedAndOpenKeys(items, location.pathname);
    setSelectedKey([result.selectedKey]);
    setOpenKeys(result.openKeys);
  }, [location]);

  const onOpenChange = (keys: string[]) => {
    // 更新展开的菜单项
    setOpenKeys(keys);
  };

  const { addRoutes } = useCustomRoutes();

  useEffect(() => {
    addRoutes(dynamicRoutes);
  }, []);

  return (
    <>
      <div className="grid grid-cols-[256px_1fr] w-full h-screen">
        <aside className="max-h-screen">
          <p>你可以在这里放logo</p>
          <Menu
            className="max-h-full overflow-y-auto"
            onClick={onClick}
            style={{ width: 256 }}
            selectedKeys={selectedKey}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            items={items}
          />
        </aside>

        <section className="w-full flex flex-col h-screen col-auto">
          <header className="flex justify-between items-center p-4">
            <div>left</div>

            <HeaderOperate />
          </header>

          <NavigationBar />

          <main className="bg-gray-50 dark:bg-black grow p-4 overflow-y-auto w-full">
            <Outlet />
          </main>
        </section>
      </div>
    </>
  );
}

export default CommonMenu;
