import { EyeInvisibleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ForageEnums, IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { resetMenu } from '@/store/slice/menu-slice'
import ChangePasswordModal from './modals/change-password-modal'
import LogoutConfirmModal from './modals/logout-confirm-modal'
import UserInfoModal from './modals/user-info-modal'
import { forage } from '@/utils/localforage'

const UserDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-surface);
  }
`

const UserAvatar = styled(Avatar)`
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;

  ${UserDropdownWrapper}:hover & {
    border-color: var(--color-primary);
  }
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;

  @media (max-width: 768px) {
    display: none;
  }
`

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserHint = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-disabled);
  white-space: nowrap;
`

const DropdownIcon = styled.svg`
  width: 1rem;
  height: 1rem;
  color: var(--color-text-disabled);
  transition: transform 0.3s ease;
  flex-shrink: 0;

  ${UserDropdownWrapper}:hover & {
    transform: rotate(180deg);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const MenuItemIcon = styled.span<{ $color: string }>`
  color: ${props => props.$color};
`

const MenuItemLabel = styled.span`
  color: var(--color-text);
  font-weight: 500;
`

const UserDropdown: React.FC = () => {
  const [userName] = useState('默认用户名')
  const [userAvatar] = useState('默认头像')
  const [showUserInfoModal, setShowUserInfoModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useCustomNavigate()

  useEffect(() => {
    // 这里可以添加代码来获取用户名和头像
    // 例如，使用 fetch 请求后端 API
    // setUserName('获取到的用户名');
    // setUserAvatar('获取到的头像');
  }, [])

  const handleLogout = () => {
    dispatch(resetMenu({}))
    sessionStorage.setItem(`${SessionStorageKeys.IS_LOGIN}`, `${IsLogin.NO}`)

    forage.removeItem(ForageEnums.TOKEN)

    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: 'userInfo',
      icon: (
        <MenuItemIcon $color="#3b82f6">
          <UserOutlined />
        </MenuItemIcon>
      ),
      label: <MenuItemLabel>个人信息</MenuItemLabel>,
      onClick: () => {
        setShowUserInfoModal(true)
      },
    },
    {
      key: 'resetPassword',
      icon: (
        <MenuItemIcon $color="#a855f7">
          <EyeInvisibleOutlined />
        </MenuItemIcon>
      ),
      label: <MenuItemLabel>修改密码</MenuItemLabel>,
      onClick: () => {
        setShowPasswordModal(true)
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: (
        <MenuItemIcon $color="#ef4444">
          <LogoutOutlined />
        </MenuItemIcon>
      ),
      label: <MenuItemLabel>退出登录</MenuItemLabel>,
      onClick: () => {
        setShowLogoutModal(true)
      },
    },
  ]

  return (
    <>
      <Dropdown
        menu={{
          items,
          style: {
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: 'var(--color-background)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--color-border)',
            minWidth: '200px',
          },
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <UserDropdownWrapper>
          <UserAvatar size="default" src={userAvatar} alt={userName} />
          <UserInfo>
            <UserName>{userName}</UserName>
            <UserHint>点击查看菜单</UserHint>
          </UserInfo>
          <DropdownIcon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </DropdownIcon>
        </UserDropdownWrapper>
      </Dropdown>

      <UserInfoModal
        open={showUserInfoModal}
        onCancel={() => setShowUserInfoModal(false)}
        initialValues={{
          username: userName,
          email: '', // TODO: 从用户数据中获取
          avatar: userAvatar,
        }}
      />

      <ChangePasswordModal open={showPasswordModal} onCancel={() => setShowPasswordModal(false)} />

      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}

export default UserDropdown
