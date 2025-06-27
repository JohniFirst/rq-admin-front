import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
// import { pushNavItemAction } from '@/store/slice/system-info.ts'
import { Popover } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ForageEnums } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import { forage } from '@/utils/localforage'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

const TopLevelMenu = styled.ul`
  text-align: center;
  cursor: pointer;
  background: var(--color-surface);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  padding: 12px 0;
  transition: background 0.3s;
  border-radius: 1rem;
  user-select: none;

  li {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 15px;
		color: var(--color-text);
		margin: 0 8px 12px 8px;
		padding: 12px 16px;
		border-radius: 12px;
		transition: background 0.3s, color 0.3s;

		&:last-child {
			margin-bottom: 0;
		}

		&:hover:not(.activeTopMenu) {
			background: var(--color-surface-hover);
			color: var(--color-primary);
		}
  }
`

const ActiveTopMenu = styled.li`
  color: var(--color-primary-contrast, #fff);
  background: var(--color-primary);
  box-shadow: 0 2px 8px 0 rgba(37, 99, 235, 0.1);
  border-radius: 12px;
`

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
	const menusRaw = useAppSelector((state) => state.menu)
	const menus: MenuItem[] = Array.isArray(menusRaw) ? menusRaw : []
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
				if (Array.isArray(item.children)) {
					if (item.children.some((child: MenuItem) => child.key === path)) {
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

	const [selectedKey, setSelectedKey] = useState([''])
	const [_openKeys, setOpenKeys] = useState<string[]>([])

	useEffect(() => {
		const result = findSelectedAndOpenKeys(menus, location.pathname)
		setSelectedKey([result.selectedKey])
		setOpenKeys(result.openKeys)
	}, [location, menus])

	// const onOpenChange = (keys: string[]) => {
	// 	// 更新展开的菜单项
	// 	setOpenKeys(keys)
	// }

	// 递归渲染多级菜单项，children 以 Popover 方式展示
	function RecursiveMenuItem({ item, selectedKey, navigate }: any) {
		const isActive = selectedKey.includes(item.key)
		const hasChildren = Array.isArray(item.children) && item.children.length > 0
		const content = hasChildren ? (
			<ul className='min-w-36'>
				{item.children.map((child: any) => (
					<RecursiveMenuItem key={child.key} item={child} selectedKey={selectedKey} navigate={navigate} />
				))}
			</ul>
		) : null

		const li = isActive ? (
			<ActiveTopMenu
				key={item.key}
				className='select-none cursor-pointer px-3 py-1 rounded mb-1'
				onClick={(e) => {
					e.stopPropagation()
					navigate(item.key)
				}}
			>
				{item.icon} <span className='ml-2'>{item.label}</span>
			</ActiveTopMenu>
		) : (
			<li
				key={item.key}
				className='select-none cursor-pointer px-3 py-1 rounded mb-1'
				style={{
					color: 'var(--color-text)',
					background: 'transparent',
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
		<div className='grid grid-cols-[auto_1fr] w-full h-screen bg-[var(--color-background)] dark:bg-[var(--color-background)]'>
			{menuVisible && (
				<aside className='max-h-screen flex'>
					<TopLevelMenu>
						{menus.map((item) => {
							const isActive = topActiveMenu.key === item.key || selectedKey.includes(item.key)
							return isActive ? (
								<ActiveTopMenu
									className='select-none cursor-pointer transition-colors duration-200'
									key={item.key}
									onClick={() => setTopActiveMenu(item)}
									onKeyUp={() => setTopActiveMenu(item)}
								>
									<span className='text-xl mb-1'>{item.icon}</span>
									<p className='text-xs font-medium tracking-wide'>{item.label}</p>
								</ActiveTopMenu>
							) : (
								<li
									className='select-none cursor-pointer transition-colors duration-200'
									key={item.key}
									onClick={() => setTopActiveMenu(item)}
									onKeyUp={() => setTopActiveMenu(item)}
									style={{
										color: 'var(--color-text)',
									}}
								>
									<span className='text-xl mb-1'>{item.icon}</span>
									<p className='text-xs font-medium tracking-wide'>{item.label}</p>
								</li>
							)
						})}
					</TopLevelMenu>

					{topActiveMenu.children ? (
						<ul className='w-44 max-h-full overflow-y-auto rounded-xl shadow bg-[var(--color-surface)] dark:bg-[var(--color-surface)] transition-colors duration-300'>
							{topActiveMenu.children.map((item: any) => (
								<RecursiveMenuItem key={item.key} item={item} selectedKey={selectedKey} navigate={navigate} />
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
	)
}

export default DrawerMenu
