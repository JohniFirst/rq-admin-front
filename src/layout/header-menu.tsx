import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

interface HeaderMenuProps {
	showHeaderOperate?: boolean
}

// 定义兼容 antd MenuItem 的类型
interface MenuItem {
	key: string
	label?: React.ReactNode
	children?: MenuItem[]
	[key: string]: any
}

/**
 * 顶部导航菜单
 */
function HeaderMenu({ showHeaderOperate = true }: HeaderMenuProps) {
	const navigate = useCustomNavigate()
	const dispatch = useAppDispatch()
	const menusRaw = useAppSelector((state) => state.menu)
	const menus: MenuItem[] = Array.isArray(menusRaw) ? menusRaw : []
	const showNavigationBar = useAppSelector((state) => state.systemInfo.showNavigationBar)

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

	const location = useLocation()

	// 找到当前选中项和需要展开的项
	const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
		let selectedKey = ''
		const openKeys: string[] = []

		const findKeys = (items: MenuItem[] = []) => {
			for (const item of items) {
				if (!item) continue
				if ('children' in item && Array.isArray(item.children)) {
					if (item.children.some((child: MenuItem) => child && child.key === currentPath)) {
						selectedKey = currentPath
						if (item.key) openKeys.push(item.key as string)
					}
					findKeys(item.children)
				} else if (item.key === currentPath) {
					selectedKey = currentPath
				}
			}
		}

		findKeys(items)
		return { selectedKey, openKeys }
	}

	const [selectedKey, setSelectedKey] = useState<string[]>([])

	useEffect(() => {
		const result = findSelectedAndOpenKeys(menus, location.pathname)
		if (result.selectedKey) {
			setSelectedKey([result.selectedKey])
		} else {
			setSelectedKey([])
		}
	}, [location.pathname, menus])

	return (
		<section className='w-full flex flex-col h-screen col-auto'>
			<header className='flex justify-between items-center p-4'>
				<Menu mode='horizontal' onClick={onClick} selectedKeys={selectedKey} items={menus} />

				{showHeaderOperate && <HeaderOperate />}
			</header>

			{showNavigationBar && <NavigationBar />}

			<main className='bg-gray-50 dark:bg-black grow p-4 overflow-y-auto w-full'>
				<Outlet />
			</main>
		</section>
	)
}

export default HeaderMenu
