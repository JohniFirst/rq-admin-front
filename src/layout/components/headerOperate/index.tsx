import { Space } from "antd";
import FullScreen from "./FullScreen";
import MessageNotification from "./MessageNotification";
import UserDropdown from "./UserDropdown";
import SystemSettings from "./SystemSettings";
import SearchableMenu from "./SearchableMenu";
import ThemeSwitcher from "./ThemeSwitcher";

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
