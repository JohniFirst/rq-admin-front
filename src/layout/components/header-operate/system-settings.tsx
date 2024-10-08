import CommonMenu from '@/assets/svgs/nav-type/common-menu.svg'
import DrawerMenu from '@/assets/svgs/nav-type/drawer-menu.svg'
import HeaderMenu from '@/assets/svgs/nav-type/top-menu.svg'
import { SettingOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'
import type React from 'react'
import { useState } from 'react'

import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setlayoutMode } from '@/store/slice/system-info'
import system from './css/system.module.css'

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
	const [isDrawerVisible, setIsDrawerVisible] = useState(false)
	const layoutMode = useAppSelector((state) => state.systemInfo.layoutMode)
	const dispatch = useAppDispatch()

	const toggleDrawer = () => {
		setIsDrawerVisible(!isDrawerVisible)
	}

	return (
		<>
			<SettingOutlined onClick={toggleDrawer} />

			<Drawer
				title='系统设置'
				placement='right'
				onClose={toggleDrawer}
				open={isDrawerVisible}
			>
				<p className={system.systemNavTitle}>导航模式</p>
				<div className='grid grid-cols-2 gap-4'>
					{layoutModeArr.map((item) => (
						<img
							key={item.value}
							className={`${
								layoutMode === item.value ? system.activelayoutMode : ''
							}`}
							onClick={() => dispatch(setlayoutMode(item.value))}
							onKeyUp={() => dispatch(setlayoutMode(item.value))}
							src={item.imgSrc}
							alt={item.title}
						/>
					))}
				</div>

				<p className={system.systemNavTitle}>快捷键</p>
				<ul>
					<li>【Ctrl + M】 打开菜单搜索界面</li>
					<li>【Ctrl + 鼠标左键】 快速定位到vscode源码</li>
				</ul>
			</Drawer>
		</>
	)
}

export default SystemSettings
