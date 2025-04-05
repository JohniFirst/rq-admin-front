import { IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { resetMenu } from '@/store/slice/menu-slice'
import {
	EyeInvisibleOutlined,
	LogoutOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'

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
			icon: <UserOutlined className='text-blue-500' />,
			label: (
				<span className='text-gray-700 dark:text-gray-200 font-medium'>
					查看个人信息
				</span>
			),
			onClick: () => {
				navigate('/system/user-info')
			},
		},
		{
			key: 'resetPassword',
			icon: <EyeInvisibleOutlined className='text-purple-500' />,
			label: (
				<span className='text-gray-700 dark:text-gray-200 font-medium'>
					修改密码
				</span>
			),
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <LogoutOutlined className='text-red-500' />,
			label: (
				<span className='text-gray-700 dark:text-gray-200 font-medium'>
					退出登录
				</span>
			),
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
		<Dropdown
			menu={{
				items,
				className:
					'mt-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700',
			}}
			trigger={['click']}
			placement='bottomRight'
		>
			<div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-all duration-300'>
				<Avatar
					size='default'
					src={userAvatar}
					alt={userName}
					className='border-2 border-transparent hover:border-indigo-500 transition-all duration-300'
				/>
				<span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
					{userName}
				</span>
			</div>
		</Dropdown>
	)
}

export default UserDropdown
