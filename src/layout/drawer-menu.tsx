import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'
import drawer from './css/drawerMenu.module.css'

import { HomeOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

interface DrawerMenuProps {
	showHeaderOperate?: boolean
}

/**
 * 可折叠的子菜单
 */
function DrawerMenu({ showHeaderOperate = true }: DrawerMenuProps) {
	const navigate = useCustomNavigate()
	const dispatch = useAppDispatch()
	const menus = useAppSelector((state) => state.menu)
	const showNavigationBar = useAppSelector(
		(state) => state.systemInfo.showNavigationBar,
	)
	const [topActiveMenu, setTopActiveMenu] = useState<MenuItem>(menus[0])

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

		const findKeys = (items: MenuItem[]) => {
			for (const item of items) {
				if (item && Object.keys(item).includes('children')) {
					// @ts-ignore
					const children = item.children
					if (
						Array.isArray(children) &&
						children.some((child: { key: string }) => child.key === currentPath)
					) {
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
	const [openKeys, setOpenKeys] = useState<string[]>([])

	useEffect(() => {
		const result = findSelectedAndOpenKeys(menus, location.pathname)
		setSelectedKey([result.selectedKey])
		setOpenKeys(result.openKeys)
	}, [location])

	const onOpenChange = (keys: string[]) => {
		// 更新展开的菜单项
		setOpenKeys(keys)
	}

	return (
		<>
			<div className='grid grid-cols-[auto_1fr] w-full h-screen bg-[var(--color-background)] dark:bg-[var(--color-background)]'>
				<aside className='max-h-screen flex'>
					<ul
						className={drawer.topLevelMenu + ' transition-colors duration-300'}
					>
						{menus.map((item) => {
							return (
								<li
									className={`select-none cursor-pointer ${drawer.topLevelMenu} ${topActiveMenu.key === item.key ? drawer.activeTopMenu : ''} transition-colors duration-200`}
									key={item.key}
									onClick={() => setTopActiveMenu(item)}
									onKeyUp={() => setTopActiveMenu(item)}
									style={{
										color:
											topActiveMenu.key === item.key
												? 'var(--color-primary-contrast, #fff)'
												: 'var(--color-text)',
									}}
								>
									<span className='text-xl mb-1'>{item.icon}</span>
									<p className='text-xs font-medium tracking-wide'>
										{item.label}
									</p>
								</li>
							)
						})}
					</ul>

					{topActiveMenu.children ? (
						<Menu
							className='max-h-full overflow-y-auto rounded-xl shadow bg-[var(--color-surface)] dark:bg-[var(--color-surface)] transition-colors duration-300'
							onClick={onClick}
							style={{ width: 180, background: 'var(--color-surface)' }}
							selectedKeys={selectedKey}
							openKeys={openKeys}
							onOpenChange={onOpenChange}
							mode='inline'
							items={topActiveMenu.children}
						/>
					) : null}
				</aside>

				<section className='w-full flex flex-col h-screen col-auto'>
					<header className='flex justify-between items-center p-4'>
						<Link to={'/dashboard'}>
							<HomeOutlined />
						</Link>

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
