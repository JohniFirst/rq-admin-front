import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { port1 } from "@/utils/globalMessageChannel";

import { ForageEnums } from "@/enums/localforage";
import { forage } from "@/utils/localforage";

// 定义主题样式的类型
type Theme = "light" | "dark";

const ThemeSwitcher: React.FC = () => {
  // 设置state来存储当前主题
  const [theme, setTheme] = useState<Theme>("light");

  // 切换主题的函数
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // 更新html的类来改变主题
    document.documentElement.className = newTheme;
    // 当主题改变时，更新本地存储
    forage.setItem(ForageEnums.THEME, newTheme);
    port1.postMessage(newTheme);
  };

  // 当组件挂载时，尝试读取本地存储的主题设置
  useEffect(() => {
    forage.getItem<Theme>(ForageEnums.THEME).then((storedTheme) => {
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.className = storedTheme;
      }
    });
  }, []);

  return (
    <Switch
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
      checked={theme === "dark"}
      onChange={toggleTheme}
    />
  );
};

export default ThemeSwitcher;
