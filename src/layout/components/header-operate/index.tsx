import styled from 'styled-components'
import FullScreen from './full-screen'
import MessageNotification from './message-notification'
import SearchableMenu from './searchable-menu'
import ThemeSwitcher from './theme-switcher'
import UserDropdown from './user-dropdown'

const HeaderOperateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

function HeaderOperate() {
  return (
    <HeaderOperateWrapper>
      <SearchableMenu />
      <ThemeSwitcher />
      <MessageNotification unreadMessages={3} />
      <FullScreen />
      <UserDropdown />
    </HeaderOperateWrapper>
  )
}

export default HeaderOperate
