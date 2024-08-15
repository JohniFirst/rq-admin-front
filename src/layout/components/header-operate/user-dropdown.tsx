import React, { useEffect, useState } from 'react'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const UserDropdown: React.FC = () => {
  const [userName] = useState('默认用户名')
  const [userAvatar] = useState('默认头像')

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
      label: '查看个人信息'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        //TODO 退出登录的逻辑
        navigate('/login')
      }
    }
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Avatar size="default" src={userAvatar} alt={userName} />
    </Dropdown>
  )
}

export default UserDropdown
