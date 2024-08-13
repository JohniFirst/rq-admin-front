import { Space } from "antd";
import FullScreen from "./full-screen";
import MessageNotification from "./message-notification";
import UserDropdown from "./user-dropdown";
import SystemSettings from "./system-settings";
import SearchableMenu from "./searchable-menu";
import ThemeSwitcher from "./theme-switcher";

function HeaderOperate() {
  return (
    <Space size="large">
      <SearchableMenu />

      <ThemeSwitcher />

      <MessageNotification unreadMessages={3} />

      <FullScreen />

      <SystemSettings />

      <UserDropdown />
    </Space>
  );
}

export default HeaderOperate;
