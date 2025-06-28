import { EyeInvisibleOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'
import { IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { resetMenu } from '@/store/slice/menu-slice'
import ChangePasswordModal from './modals/change-password-modal'
import LogoutConfirmModal from './modals/logout-confirm-modal'
import UserInfoModal from './modals/user-info-modal'

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
    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: 'userInfo',
      icon: <UserOutlined className="text-blue-500" />,
      label: <span className="text-gray-700 dark:text-gray-200 font-medium">个人信息</span>,
      onClick: () => {
        setShowUserInfoModal(true)
      },
    },
    {
      key: 'resetPassword',
      icon: <EyeInvisibleOutlined className="text-purple-500" />,
      label: <span className="text-gray-700 dark:text-gray-200 font-medium">修改密码</span>,
      onClick: () => {
        setShowPasswordModal(true)
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="text-gray-700 dark:text-gray-200 font-medium">退出登录</span>,
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
          className:
            'mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 min-w-[200px]',
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-all duration-300 group">
          <Avatar
            size="default"
            src={userAvatar}
            alt={userName}
            className="border-2 border-transparent group-hover:border-indigo-500 transition-all duration-300"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{userName}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">点击查看菜单</span>
          </div>
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500 transform group-hover:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
