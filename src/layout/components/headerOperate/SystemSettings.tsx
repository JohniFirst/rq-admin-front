import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

interface SystemSettingsProps {
  // 这里不需要定义任何接口，因为深色模式状态在组件内部管理
}

const SystemSettings: React.FC<SystemSettingsProps> = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // 这里可以添加代码来切换深色模式
    console.log("Dark mode toggled:", isDarkMode);
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
        <Button type="primary" onClick={toggleDarkMode}>
          切换深色模式
        </Button>
        {/* 添加更多设置项的逻辑 */}
      </Drawer>
    </>
  );
};

export default SystemSettings;
