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

/** * 常规菜单 */
function CommonMenu() {
	const navigate = useCustomNavigate()
	const dispatch = useAppDispatch()
	const menus = menuItenWithIcon(useAppSelector((state) => state.menu))
	console.log('menus', menus)
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
			<div className='grid grid-cols-[256px_1fr] w-full h-screen'>
				<aside className='max-h-screen'>
					<p>你可以在这里放logo</p>

					<Menu
						className='max-h-full overflow-y-auto'
						onClick={onClick}
						selectedKeys={selectedKey}
						openKeys={openKeys}
						onOpenChange={(keys) => setOpenKeys(keys)}
						mode='inline'
						items={menus}
					/>
				</aside>

				<section className='w-full flex flex-col h-screen col-auto'>
					<header className='flex justify-between items-center p-4'>
						<Link to={'/dashboard'}>
							<HomeOutlined />
						</Link>

						<HeaderOperate />
					</header>

					<NavigationBar />

					<main className='bg-gray-50 dark:bg-black grow p-4 overflow-y-auto w-full'>
						<Outlet />
					</main>
				</section>
			</div>
		</>
	)
}

export default CommonMenu
