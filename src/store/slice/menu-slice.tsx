import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
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

const initialState: MenuSlice = {
  menu: [
    {
      key: "/dashboard",
      label: "主页",
      title: "主页",
      icon: <HomeFilled />,
    },
    {
      key: "/event",
      label: "业务组件",
      title: "业务组件",
      icon: <MehOutlined />,
      children: [
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
      key: "/event-pro",
      label: "业务组件Pro",
      title: "业务组件Pro",
      icon: <MehOutlined />,
      children: [
        {
          key: "/event-pro/danmu",
          label: "弹幕",
          title: "弹幕",
          icon: <CodeOutlined />,
        },
        {
          key: "/event-pro/video-player",
          label: "视频播放器",
          title: "视频播放器",
          icon: <VideoCameraOutlined />,
        },
        {
          key: "/event-pro/picture-stitching",
          label: "图片拼接",
          title: "图片拼接",
          icon: <VideoCameraOutlined />,
        },
        {
          key: "/event-pro/animate",
          label: "动画",
          title: "动画",
          icon: <VideoCameraOutlined />,
          children: [
            {
              key: "/event-pro/animate/share-animation",
              label: "共享元素动画",
              title: "共享元素动画",
              icon: <VideoCameraOutlined />,
            },
          ],
        },
      ],
    },
    {
      key: "/system",
      label: "系统管理",
      title: "系统管理",
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
  ],
};

export const menuSlice: Slice<MenuSlice> = createSlice({
  name: "router",
  initialState,
  reducers: {
    updateMenu(state, action: PayloadAction<MenuItem>) {
      state.menu = action.payload;
    },
  },
});

export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer;
