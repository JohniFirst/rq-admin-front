import React, { useState } from "react";
import { Drawer } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import TopMenu from "@/assets/svgs/nav-type/top-menu.svg";
import CommonMenu from "@/assets/svgs/nav-type/common-menu.svg";
import DrawerMenu from "@/assets/svgs/nav-type/drawer-menu.svg";

interface SystemSettingsProps {
  // 这里不需要定义任何接口，因为深色模式状态在组件内部管理
}

const SystemSettings: React.FC<SystemSettingsProps> = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
          <img src={CommonMenu} alt="常规菜单" />

          <img src={DrawerMenu} alt="可折叠的子菜单" />

          <img src={TopMenu} alt="顶部导航菜单" />
        </div>
      </Drawer>
    </>
  );
};

export default SystemSettings;
