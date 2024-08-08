import React, { useState, useEffect } from "react";
import { Input, List, Typography, Popover } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

interface MenuItem {
  name: string;
  path: string;
  parentName: string;
}

const SearchableMenu: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // 模拟菜单数据
    const menuData: MenuItem[] = [
      { name: "页面 1", path: "/page1", parentName: "主菜单" },
      { name: "页面 2", path: "/page2", parentName: "主菜单" },
      { name: "子页面 1", path: "/subpage1", parentName: "子菜单" },
      { name: "子页面 2", path: "/subpage2", parentName: "子菜单" },
    ];
    setMenuItems(menuData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.includes(searchText)
  );

  const content = (
    <List
      style={{ minWidth: 204 }}
      dataSource={filteredMenuItems}
      renderItem={(item) => (
        <List.Item>
          <Link to={item.path}>
            <Typography.Text strong>
              {item.parentName}:
              {searchText ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: item.name.replace(
                      new RegExp(searchText, "ig"),
                      `<span style="color: red;">${searchText}</span>`
                    ),
                  }}
                />
              ) : (
                item.name
              )}
            </Typography.Text>
          </Link>
        </List.Item>
      )}
    />
  );

  return (
    <Popover trigger="focus" content={content}>
      <Input
        prefix={<SearchOutlined />}
        onChange={handleSearchChange}
        placeholder="输入菜单名"
      />
    </Popover>
  );
};

export default SearchableMenu;
