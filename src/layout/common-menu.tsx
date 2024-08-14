import { Menu } from "antd";
import HeaderOperate from "./components/header-operate";
import NavigationBar from "./components/navigation-bar/navigation-bar";
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { pushNavItemAction } from "@/store/slice/system-info.ts";
import useCustomNavigate from "@/hooks/useCustomNavigate";

import type { MenuProps } from "antd";
import { useEffect, useState } from "react";

/**
 * 常规菜单
 */
function CommonMenu() {
  const navigate = useCustomNavigate();
  const dispatch = useAppDispatch();
  const menus = useAppSelector((state) => state.menu.menu);

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);

    dispatch(
      pushNavItemAction({
        key: e.key,
        // @ts-ignore
        label: e.item.props.title,
        active: true,
        fixed: false,
      }),
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
    const result = findSelectedAndOpenKeys(menus, location.pathname);
    setSelectedKey([result.selectedKey]);
    setOpenKeys(result.openKeys);
  }, [location]);

  const onOpenChange = (keys: string[]) => {
    // 更新展开的菜单项
    setOpenKeys(keys);
  };

  return (
    <>
      <div className="grid grid-cols-[256px_1fr] w-full h-screen">
        <aside className="max-h-screen">
          <p>你可以在这里放logo</p>
          <Menu
            className="max-h-full overflow-y-auto"
            onClick={onClick}
            selectedKeys={selectedKey}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            items={menus}
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
