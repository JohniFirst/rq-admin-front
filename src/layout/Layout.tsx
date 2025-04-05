import { getMenuList } from '@/api/system-api'
import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateMenu } from '@/store/slice/menu-slice'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import CommonMenu from './common-menu'
import SystemSettings from './components/header-operate/system-settings'
import DrawerMenu from './drawer-menu'
import HeaderMenu from './header-menu'

const layoutVariants = {
	initial: { opacity: 0, scale: 0.95 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.95 },
}

/**
 * 布局组件
 */
function Layout() {
	const layoutMode = useAppSelector((state) => state.systemInfo.layoutMode)
	const menu = useAppSelector((state) => state.menu)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const fetchMenu = async () => {
			if (menu.length === 0) {
				const res = await getMenuList()
				dispatch(updateMenu(res))
			}
		}
		fetchMenu()
	}, [menu, dispatch])

	if (menu.length === 0) {
		return <div>loading</div>
	}

	const renderLayout = () => {
		switch (layoutMode) {
			case LayoutModeEnum.COMMON_MENU:
				return <CommonMenu />
			case LayoutModeEnum.HEADER_MENU:
				return <HeaderMenu />
			default:
				return <DrawerMenu />
		}
	}

	return (
		<>
			<SystemSettings />
			<AnimatePresence mode='wait'>
				<motion.div
					key={layoutMode}
					initial='initial'
					animate='animate'
					exit='exit'
					variants={layoutVariants}
					transition={{ duration: 0.3 }}
					className='h-screen'
				>
					{renderLayout()}
				</motion.div>
			</AnimatePresence>
		</>
	)
}

export default Layout
