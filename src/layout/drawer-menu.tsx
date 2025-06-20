import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
// import { pushNavItemAction } from '@/store/slice/system-info.ts'
import { Popover } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ForageEnums } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import { forage } from '@/utils/localforage'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'
import drawer from './css/drawerMenu.module.css'

// import type { MenuProps } from 'antd'

interface DrawerMenuProps {
	showHeaderOperate?: boolean
}

/**
 * 可折叠的子菜单
 */
function DrawerMenu({ showHeaderOperate = true }: DrawerMenuProps) {
	const navigate = useCustomNavigate()
	// const dispatch = useAppDispatch()
	const menus = useAppSelector((state) => state.menu)
	const showNavigationBar = useAppSelector((state) => state.systemInfo.showNavigationBar)
	const [topActiveMenu, setTopActiveMenu] = useState<MenuItem>(menus[0])
	const [menuVisible, setMenuVisible] = useState(true)

	const location = useLocation()

	// 根据当前路由自动设置高亮的顶级菜单
	useEffect(() => {
		// 遍历所有菜单，找到包含当前路由的顶级菜单
		const findTopMenu = (items: MenuItem[], path: string): MenuItem | undefined => {
			for (const item of items) {
				if (item.key === path) return item
				if (item.children) {
					// @ts-ignore
					if (item.children.some((child: { key: string }) => child.key === path)) {
						return item
					}
					const found = findTopMenu(item.children, path)
					if (found) return found
				}
			}
			return undefined
		}
		const current = findTopMenu(menus, location.pathname)
		if (current) setTopActiveMenu(current)
	}, [location, menus])

	// const onClick: MenuProps['onClick'] = (e) => {
	// 	navigate(e.key)

	// 	dispatch(
	// 		pushNavItemAction({
	// 			key: e.key,
	// 			// @ts-ignore
	// 			label: e.item.props.title,
	// 			active: true,
	// 			fixed: false,
	// 		}),
	// 	)
	// }

	// 找到当前选中项和需要展开的项
	const findSelectedAndOpenKeys = (items: MenuItem[], currentPath: string) => {
		let selectedKey = ''
		const openKeys: string[] = []

		const findKeys = (items: MenuItem[]) => {
			for (const item of items) {
				if (item && Object.keys(item).includes('children')) {
					// @ts-ignore
					const children = item.children
					if (Array.isArray(children) && children.some((child: { key: string }) => child.key === currentPath)) {
						selectedKey = currentPath
						openKeys.push(item.key as string)
					}
					findKeys(children)
				} else if (item?.key === currentPath) {
					selectedKey = currentPath
				}
			}
		}

		findKeys(items)
		return { selectedKey, openKeys }
	}

	const [selectedKey, setSelectedKey] = useState([''])
	const [_openKeys, setOpenKeys] = useState<string[]>([])

	useEffect(() => {
		const result = findSelectedAndOpenKeys(menus, location.pathname)
		setSelectedKey([result.selectedKey])
		setOpenKeys(result.openKeys)
	}, [location])

	// const onOpenChange = (keys: string[]) => {
	// 	// 更新展开的菜单项
	// 	setOpenKeys(keys)
	// }

	// 递归渲染多级菜单项，children 以 Popover 方式展示
	function RecursiveMenuItem({ item, selectedKey, navigate, drawer }: any) {
		const isActive = selectedKey.includes(item.key)
		const hasChildren = Array.isArray(item.children) && item.children.length > 0
		const content = hasChildren ? (
			<ul className='min-w-36'>
				{item.children.map((child: any) => (
					<RecursiveMenuItem
						key={child.key}
						item={child}
						selectedKey={selectedKey}
						navigate={navigate}
						drawer={drawer}
					/>
				))}
			</ul>
		) : null

		const li = (
			<li
				key={item.key}
				className={`select-none cursor-pointer px-3 py-1 rounded mb-1 ${isActive ? drawer.activeTopMenu : ''}`}
				style={{
					color: isActive ? 'var(--color-primary-contrast, #fff)' : 'var(--color-text)',
					background: isActive ? 'var(--color-primary)' : 'transparent',
				}}
				onClick={(e) => {
					e.stopPropagation()
					navigate(item.key)
				}}
			>
				{item.icon} <span className='ml-2'>{item.label}</span>
			</li>
		)

		return hasChildren ? (
			<Popover placement='rightTop' content={content} trigger='hover'>
				{li}
			</Popover>
		) : (
			li
		)
	}

	// 初始化时从forage读取menuVisible
	useEffect(() => {
		forage.getItem<boolean>(ForageEnums.DRAWER_MENU_VISIBLE).then((v) => {
			if (typeof v === 'boolean') setMenuVisible(v)
			if (typeof v === 'string') setMenuVisible(v === 'true')
		})
	}, [])

	// menuVisible变化时持久化
	useEffect(() => {
		forage.setItem(ForageEnums.DRAWER_MENU_VISIBLE, String(menuVisible))
	}, [menuVisible])

	return (
		<>
			<div className='grid grid-cols-[auto_1fr] w-full h-screen bg-[var(--color-background)] dark:bg-[var(--color-background)]'>
				{menuVisible && (
					<aside className='max-h-screen flex'>
						<ul className={drawer.topLevelMenu + ' transition-colors duration-300'}>
							{menus.map((item) => {
								const isActive = topActiveMenu.key === item.key || selectedKey.includes(item.key)
								return (
									<li
										className={`select-none cursor-pointer ${drawer.topLevelMenu} ${isActive ? drawer.activeTopMenu : ''} transition-colors duration-200`}
										key={item.key}
										onClick={() => setTopActiveMenu(item)}
										onKeyUp={() => setTopActiveMenu(item)}
										style={{
											color: isActive ? 'var(--color-primary-contrast, #fff)' : 'var(--color-text)',
										}}
									>
										<span className='text-xl mb-1'>{item.icon}</span>
										<p className='text-xs font-medium tracking-wide'>{item.label}</p>
									</li>
								)
							})}
						</ul>

						{topActiveMenu.children ? (
							<ul
								className={[
									'w-44 max-h-full overflow-y-auto rounded-xl shadow bg-[var(--color-surface)]',
									'dark:bg-[var(--color-surface)]',
									'transition-colors duration-300',
									drawer.topLevelMenu,
								].join(' ')}
							>
								{topActiveMenu.children.map((item: any) => (
									<RecursiveMenuItem
										key={item.key}
										item={item}
										selectedKey={selectedKey}
										navigate={navigate}
										drawer={drawer}
									/>
								))}
							</ul>
						) : null}
					</aside>
				)}

				<section className='w-full flex flex-col h-screen col-auto'>
					<header className='flex justify-between items-center p-4'>
						<div className='flex items-center gap-2'>
							<button type='button' onClick={() => setMenuVisible((v) => !v)} className='text-xl'>
								{menuVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
							</button>
							<Link to={'/dashboard'}>
								<HomeOutlined />
							</Link>
						</div>

						{showHeaderOperate && <HeaderOperate />}
					</header>

					{showNavigationBar && <NavigationBar />}

					<main className='bg-gray-50 dark:bg-black grow p-4 overflow-y-auto w-full'>
						<Outlet />
					</main>
				</section>
			</div>
		</>
	)
}

export default DrawerMenu
