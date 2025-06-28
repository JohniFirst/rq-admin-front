import { Space } from 'antd'
import FullScreen from './full-screen'
import MessageNotification from './message-notification'
import SearchableMenu from './searchable-menu'
import ThemeSwitcher from './theme-switcher'
import UserDropdown from './user-dropdown'

function HeaderOperate() {
  return (
    <Space size="large">
      <SearchableMenu />

      <ThemeSwitcher />

      <MessageNotification unreadMessages={3} />

      <FullScreen />

      <UserDropdown />
    </Space>
  )
}

export default HeaderOperate
