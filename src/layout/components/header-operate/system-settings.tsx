import React, { useState } from "react";
import { Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import HeaderMenu from "@/assets/svgs/nav-type/top-menu.svg";
import CommonMenu from "@/assets/svgs/nav-type/common-menu.svg";
import DrawerMenu from "@/assets/svgs/nav-type/drawer-menu.svg";

import system from "./css/system.module.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MenuModeEnum } from "@/enums/system";
import { setMenuMode } from "@/store/slice/system-info";

interface SystemSettingsProps {
  // 这里不需要定义任何接口，因为深色模式状态在组件内部管理
}

const menuModeArr = [
  {
    imgSrc: CommonMenu,
    title: "常规菜单",
    value: MenuModeEnum.COMMON_MENU,
  },
  {
    imgSrc: DrawerMenu,
    title: "可折叠的子菜单",
    value: MenuModeEnum.DRAWER_MENU,
  },
  {
    imgSrc: HeaderMenu,
    title: "顶部导航菜单",
    value: MenuModeEnum.HEADER_MENU,
  },
];

const SystemSettings: React.FC<SystemSettingsProps> = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const menuMode = useAppSelector((state) => state.systemInfo.menuMode);
  const dispatch = useAppDispatch();

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <>
      <SettingOutlined onClick={toggleDrawer} />

      <Drawer
        title="系统设置"
        placement="right"
        closable={false}
        onClose={toggleDrawer}
        open={isDrawerVisible}
      >
        {/* 添加更多设置项的逻辑 */}
        <p>导航模式</p>
        <div className="grid grid-cols-2 gap-4">
          {menuModeArr.map((item) => (
            <img
              key={item.value}
              className={`${
                menuMode === item.value ? system.activeMenuMode : ""
              }`}
              onClick={() => dispatch(setMenuMode(item.value))}
              src={item.imgSrc}
              alt={item.title}
            />
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default SystemSettings;
