import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { pushNavItemAction } from '@/store/slice/system-info.ts'
import { HomeOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
// import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
import type { MenuProps } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import HeaderOperate from './components/header-operate'
import NavigationBar from './components/navigation-bar/navigation-bar'

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

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, x: -20 },
	show: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			stiffness: 300,
			damping: 24,
		},
	},
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
		<motion.div
			className='grid grid-cols-[256px_1fr] w-full h-screen bg-gray-50 dark:bg-gray-900'
			initial='hidden'
			animate='show'
			variants={containerVariants}
		>
			<motion.aside
				className='max-h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300'
				variants={itemVariants}
			>
				<motion.div
					className='p-4 border-b border-gray-100 dark:border-gray-700'
					variants={itemVariants}
				>
					<motion.h1
						className='text-xl font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						RQ Admin
					</motion.h1>
				</motion.div>

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
			</motion.aside>

			<motion.section
				className='w-full flex flex-col h-screen col-auto'
				variants={itemVariants}
			>
				<motion.header
					className='flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm z-10'
					variants={itemVariants}
				>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Link
							to={'/dashboard'}
							className='text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300'
						>
							<HomeOutlined className='text-xl' />
						</Link>
					</motion.div>

					{showHeaderOperate && <HeaderOperate />}
				</motion.header>

				<NavigationBar />

				<motion.main
					className='bg-gray-50 dark:bg-gray-900 grow p-6 overflow-y-auto w-full'
					variants={itemVariants}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 30,
						delay: 0.2,
					}}
				>
					<motion.div
						className='fade-in'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4 }}
					>
						<Outlet />
					</motion.div>
				</motion.main>
			</motion.section>
		</motion.div>
	)
}

export default CommonMenu
