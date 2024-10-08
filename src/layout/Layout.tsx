// import { getMenuList } from '@/api/system-api'
import { LayoutModeEnum } from '@/enums/system'
import { useAppSelector } from '@/store/hooks'
// import { updateMenu } from '@/store/slice/menu-slice'
import CommonMenu from './common-menu'
import DrawerMenu from './drawer-menu'
import HeaderMenu from './header-menu'

/**
 * 布局组件
 */
function Layout() {
	const layoutMode = useAppSelector((state) => state.systemInfo.layoutMode)
	// const menu = useAppSelector((state) => state.menu)
	// const dispatch = useAppDispatch()

	// const getMenu = async () => {
	// 	const res = await getMenuList()

	// 	dispatch(updateMenu(res))
	// }

	// if (menu.length === 0) {
	// 	getMenu()
	// 	return <div>loading</div>
	// }

	switch (layoutMode) {
		case LayoutModeEnum.COMMON_MENU:
			return <CommonMenu />

		case LayoutModeEnum.HEADER_MENU:
			return <HeaderMenu />

		default:
			return <DrawerMenu />
	}
}

export default Layout
