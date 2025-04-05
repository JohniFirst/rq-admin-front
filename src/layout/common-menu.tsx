import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import { Menu } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

import { HomeOutlined } from '@ant-design/icons'
// import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
import type { MenuProps } from 'antd'
import { useEffect, useState } from 'react'

const menuItenWithIcon = (menu: MenuItem[]): MenuItem[] => {
	return menu.map((item) => {
		const tempMenu: MenuItem = {
			key: item.url,
			label: item.title,
			title: item.title,
			// icon: <LucideIcon name={item.icon as LucideIconType} />,
		}

		if (item.children) {
			tempMenu.children = menuItenWithIcon(item.children)
		}
		return tempMenu
	})
}

interface CommonMenuProps {
	showHeaderOperate?: boolean
}

/** * 常规菜单 */
function CommonMenu({ showHeaderOperate = true }: CommonMenuProps) {
	const navigate = useCustomNavigate()
	const dispatch = useAppDispatch()
	const menus = menuItenWithIcon(useAppSelector((state) => state.menu))
	const location = useLocation()
	const [selectedKey, setSelectedKey] = useState([''])
	const [openKeys, setOpenKeys] = useState<string[]>([])

	// 找到当前选中项和需要展开的项
	const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
		let selectedKey = ''

		const findKeys = (items: MenuItem[]): string[] | undefined => {
			for (let i = 0, l = items.length; i < l; i++) {
				if (items[i].key === currentPath) {
					selectedKey = items[i].key
					return [items[i].key] // Ensure it returns an array
				}

				if (items[i].children) {
					const tempResult = findKeys(items[i].children)
					if (tempResult) {
						const tempOpenKey = [items[i].key]
						tempOpenKey.push(...tempResult) // Spread the result into the array
						return tempOpenKey
					}
				}
			}
		}

		const openKeys = findKeys(items) || [] // Default to an empty array if undefined

		return { selectedKey, openKeys }
	}

	useEffect(() => {
		const result = findSelectedAndOpenKeys(menus, location.pathname)
		setSelectedKey([result.selectedKey])
		setOpenKeys(result.openKeys as string[])
	}, [location])

	const onClick: MenuProps['onClick'] = (e) => {
		navigate(e.key)

		dispatch(
			pushNavItemAction({
				key: e.key,
				// @ts-ignore
				label: e.item.props.title,
				active: true,
				fixed: false,
			}),
		)
	}

	return (
		<>
			<div className='grid grid-cols-[256px_1fr] w-full h-screen bg-gray-50 dark:bg-gray-900'>
				<aside className='max-h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300'>
					<div className='p-4 border-b border-gray-100 dark:border-gray-700'>
						<h1 className='text-xl font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300'>
							RQ Admin
						</h1>
					</div>

					<Menu
						className='max-h-[calc(100vh-64px)] overflow-y-auto border-none'
						onClick={onClick}
						selectedKeys={selectedKey}
						openKeys={openKeys}
						onOpenChange={(keys) => setOpenKeys(keys)}
						mode='inline'
						items={menus}
						theme={
							document.documentElement.classList.contains('dark')
								? 'dark'
								: 'light'
						}
					/>
				</aside>

				<section className='w-full flex flex-col h-screen col-auto'>
					<header className='flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm z-10'>
						<Link
							to={'/dashboard'}
							className='text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 transform hover:scale-110'
						>
							<HomeOutlined className='text-xl' />
						</Link>

						{showHeaderOperate && <HeaderOperate />}
					</header>

					<NavigationBar />

					<main className='bg-gray-50 dark:bg-gray-900 grow p-6 overflow-y-auto w-full'>
						<div className='fade-in'>
							<Outlet />
						</div>
					</main>
				</section>
			</div>
		</>
	)
}

export default CommonMenu
