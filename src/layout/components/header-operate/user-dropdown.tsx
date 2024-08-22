import React, { useEffect, useState } from 'react'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { resetMenu } from '@/store/slice/menu-slice'
import { IsLogin, SessionStorageKeys } from '@/enums/localforage'

const UserDropdown: React.FC = () => {
  const [userName] = useState('默认用户名')
  const [userAvatar] = useState('默认头像')
  const dispatch = useAppDispatch()

  const navigate = useCustomNavigate()

  useEffect(() => {
    // 这里可以添加代码来获取用户名和头像
    // 例如，使用 fetch 请求后端 API
    // setUserName('获取到的用户名');
    // setUserAvatar('获取到的头像');
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'userInfo',
      icon: <UserOutlined />,
      label: '查看个人信息',
      onClick: () => {
        navigate('/system/user-info')
      },
    },
    {
      key: 'resetPassword',
      icon: <EyeInvisibleOutlined />,
      label: '修改密码?',
      // onClick: () => {
      //   navigate('/system/reset-password')
      // },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        dispatch(resetMenu({}))

        sessionStorage.setItem(
          `${SessionStorageKeys.IS_LOGIN}`,
          `${IsLogin.NO}`,
        )

        navigate('/login')
      },
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Avatar size="default" src={userAvatar} alt={userName} />
    </Dropdown>
  )
}

export default UserDropdown
