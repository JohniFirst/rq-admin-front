import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { getMenuList } from '@/api/system-api'
import FullscreenTransition from '@/components/FullscreenTransition'
import { LayoutModeEnum } from '@/enums/system'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateMenu } from '@/store/slice/menu-slice'
import CommonMenu from './common-menu'
import SystemSettings from './components/header-operate/system-settings'
import DrawerMenu from './drawer-menu'
import HeaderMenu from './header-menu'

const layoutVariants = {
	initial: { opacity: 0, scale: 0.96, y: 20 },
	animate: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.4,
			ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
		},
	},
	exit: {
		opacity: 0,
		scale: 0.96,
		y: 20,
		transition: {
			duration: 0.3,
			ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
		},
	},
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
			<FullscreenTransition>
				<AnimatePresence mode='wait'>
					<motion.div
						key={layoutMode}
						initial='initial'
						animate='animate'
						exit='exit'
						variants={layoutVariants}
						className='h-screen'
					>
						{renderLayout()}
					</motion.div>
				</AnimatePresence>
			</FullscreenTransition>
		</>
	)
}

export default Layout
