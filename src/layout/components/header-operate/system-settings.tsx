import CommonMenu from '@/assets/svgs/nav-type/common-menu.svg'
import DrawerMenu from '@/assets/svgs/nav-type/drawer-menu.svg'
import HeaderMenu from '@/assets/svgs/nav-type/top-menu.svg'
import { SettingOutlined } from '@ant-design/icons'
import { Drawer, Switch } from 'antd'
import type React from 'react'
import { useState } from 'react'

import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setlayoutMode } from '@/store/slice/system-info'

const layoutModeArr = [
	{
		imgSrc: CommonMenu,
		title: '常规菜单',
		value: LayoutModeEnum.COMMON_MENU,
	},
	{
		imgSrc: DrawerMenu,
		title: '可折叠的子菜单',
		value: LayoutModeEnum.DRAWER_MENU,
	},
	{
		imgSrc: HeaderMenu,
		title: '顶部导航菜单',
		value: LayoutModeEnum.HEADER_MENU,
	},
]

const SystemSettings: React.FC = () => {
	const [open, setOpen] = useState(false)
	const layoutMode = useAppSelector((state) => state.systemInfo.layoutMode)
	const dispatch = useAppDispatch()

	const showDrawer = () => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}

	return (
		<>
			<SettingOutlined
				className='text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transform hover:rotate-90 transition-all duration-500'
				onClick={showDrawer}
			/>
			<Drawer
				title={
					<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
						系统设置
					</h3>
				}
				placement='right'
				onClose={onClose}
				open={open}
				className='settings-drawer'
			>
				<div className='space-y-6'>
					<section>
						<h4 className='text-base font-medium text-gray-700 dark:text-gray-300 mb-4'>
							导航菜单布局
						</h4>
						<div className='grid grid-cols-3 gap-4'>
							{layoutModeArr.map((item) => (
								<div
									key={item.value}
									className={`
										relative p-2 rounded-lg cursor-pointer transition-all duration-300
										${
											layoutMode === item.value
												? 'bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
												: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
										}
									`}
									onClick={() => dispatch(setlayoutMode(item.value))}
									onKeyUp={() => dispatch(setlayoutMode(item.value))}
								>
									<img
										src={item.imgSrc}
										alt={item.title}
										className='w-full h-auto rounded transition-transform duration-300 hover:scale-105'
									/>
									<p className='text-center text-sm mt-2 text-gray-600 dark:text-gray-400'>
										{item.title}
									</p>
									{layoutMode === item.value && (
										<div className='absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center'>
											<div className='w-2 h-2 bg-white rounded-full' />
										</div>
									)}
								</div>
							))}
						</div>
					</section>

					<section>
						<h4 className='text-base font-medium text-gray-700 dark:text-gray-300 mb-4'>
							其他设置
						</h4>
						<div className='space-y-4'>
							<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
								<span className='text-gray-600 dark:text-gray-400'>
									开启页面动画
								</span>
								<Switch defaultChecked className='bg-gray-300' />
							</div>
							<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
								<span className='text-gray-600 dark:text-gray-400'>
									显示页面切换进度条
								</span>
								<Switch defaultChecked className='bg-gray-300' />
							</div>
						</div>
					</section>
				</div>
			</Drawer>
		</>
	)
}

export default SystemSettings
