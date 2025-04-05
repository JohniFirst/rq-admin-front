import { ContextMenuKey } from '@/enums/system'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setNavItemAction } from '@/store/slice/system-info.ts'
import {
	CloseOutlined,
	DoubleLeftOutlined,
	DoubleRightOutlined,
	FilterOutlined,
	PicCenterOutlined,
	PushpinOutlined,
} from '@ant-design/icons'
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Dropdown, type MenuProps, Modal } from 'antd'
import { cloneDeep } from 'lodash-es'
import { useLocation } from 'react-router-dom'

const contextMenu: MenuProps['items'] = [
	{
		label: '在新窗口打开',
		key: ContextMenuKey.OPEN_NEW,
		icon: <PicCenterOutlined />,
	},
	{
		type: 'divider',
	},
	{
		label: '关闭左侧标签页',
		key: ContextMenuKey.CLOSE_LEFT,
		icon: <DoubleLeftOutlined />,
	},
	{
		label: '关闭右侧标签页',
		key: ContextMenuKey.CLOSE_RIGHT,
		icon: <DoubleRightOutlined />,
	},
	{
		label: '关闭其它标签页',
		key: ContextMenuKey.CLOSE_OTHERS,
		icon: <FilterOutlined />,
	},
	{
		label: '取消/固定到导航栏',
		key: ContextMenuKey.FIXED,
		icon: <PushpinOutlined />,
	},
]

function NavigationBar() {
	let currentClickTarget: NavItem
	const location = useLocation()
	const navgation = useCustomNavigate()
	const navItem = useAppSelector((state) => state.systemInfo.navItem)

	const dispatch = useAppDispatch()
	const setNavItem = (navItem: NavItem[]) => {
		dispatch(setNavItemAction(navItem))
	}

	/**
	 * Handles the click event on the menu.
	 *
	 * @param {MenuProps["onClick"]} e - The click event object.
	 * @return {void} This function does not return anything.
	 */
	const handleMenuClick: MenuProps['onClick'] = (e) => {
		const clickIndex = navItem.findIndex(
			(item) => item.key === currentClickTarget.key,
		)
		let newNavItem: NavItem[] = []

		switch (e.key) {
			case ContextMenuKey.OPEN_NEW:
				window.open(window.location.origin + currentClickTarget.key)
				break

			case ContextMenuKey.CLOSE_LEFT:
				for (let index = 0; index < clickIndex; index++) {
					if (navItem[index].fixed) {
						newNavItem.push(navItem[index])
					}
				}

				newNavItem.push(...navItem.slice(clickIndex))

				setNavItem(newNavItem)
				break

			case ContextMenuKey.CLOSE_RIGHT:
				newNavItem.push(...navItem.slice(0, clickIndex + 1))
				for (let index = clickIndex + 1; index < navItem.length; index++) {
					if (navItem[index]?.fixed) {
						newNavItem.push(navItem[index])
					}
				}
				setNavItem(newNavItem)
				break

			case ContextMenuKey.CLOSE_OTHERS:
				setNavItem(
					navItem.filter(
						(item) => item.key === currentClickTarget.key || item.fixed,
					),
				)
				break

			default:
				newNavItem = cloneDeep(navItem)
				newNavItem[clickIndex].fixed = !newNavItem[clickIndex].fixed

				setNavItem(newNavItem)
				break
		}
	}

	/**
	 * Closes the current navigation item.
	 *
	 * @param {React.MouseEvent<HTMLElement, MouseEvent>} e - The mouse event that triggered the function.
	 * @param {NavItem} item - The navigation item to be closed.
	 * @return {void} This function does not return anything.
	 */
	const closeCurrentNav = async (
		e: React.MouseEvent<HTMLElement, MouseEvent>,
		item: NavItem,
	) => {
		e.stopPropagation()

		if (item.fixed) {
			Modal.warning({
				title: '提示',
				content: '当前标签页固定到导航栏，是否关闭?',
				okText: '关闭',
				okCancel: true,
				cancelText: '取消',
				onOk: () => {
					setNavItem(navItem.filter((nav) => nav.key !== item.key))
				},
			})

			return
		}

		setNavItem(navItem.filter((nav) => nav.key !== item.key))
	}

	const sensor = useSensor(PointerSensor, {
		activationConstraint: { distance: 10 },
	})

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			const temp = (() => {
				const activeIndex = navItem.findIndex((i) => i.key === active.id)
				const overIndex = navItem.findIndex((i) => i.key === over?.id)
				return arrayMove(navItem, activeIndex, overIndex)
			})()
			setNavItem(temp)
		}
	}

	const DraggableTabNode = ({ item }: { item: NavItem }) => {
		const { transform, transition, setNodeRef, attributes, listeners } =
			useSortable({ id: item.key })

		const style: React.CSSProperties = {
			transform: CSS.Translate.toString(transform),
			transition,
			cursor: 'move',
		}

		return (
			<li
				key={item.key + '1'}
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={style}
				className={`${
					location.pathname === item.key
						? 'bg-surface-hover text-primary border-primary border-x border-y'
						: 'text-text-secondary hover:bg-surface-hover'
				} cursor-pointer bg-surface py-1 px-3 rounded-md shrink-0 transition-colors duration-200 ease-in-out`}
				onClick={() => navgation(item.key)}
				onContextMenu={() => (currentClickTarget = item)}
			>
				{item.fixed ? <PushpinOutlined className='text-danger' /> : ''}
				<span className='mx-1'>{item.label}</span>
				<CloseOutlined
					className='p-1 text-text-secondary hover:text-text hover:bg-surface-active rounded transition-colors duration-200'
					onClick={(e) => closeCurrentNav(e, item)}
				/>
			</li>
		)
	}

	return (
		<nav className='flex items-center gap-2 px-2 py-1 overflow-x-auto bg-background'>
			<DndContext
				sensors={[sensor]}
				collisionDetection={closestCenter}
				onDragEnd={onDragEnd}
			>
				<SortableContext
					items={navItem.map((i) => i.key)}
					strategy={horizontalListSortingStrategy}
				>
					<Dropdown
						menu={{ items: contextMenu, onClick: handleMenuClick }}
						trigger={['contextMenu']}
					>
						<ul className='flex items-center gap-2'>
							{navItem.map((item) => (
								<DraggableTabNode key={item.key} item={item} />
							))}
						</ul>
					</Dropdown>
				</SortableContext>
			</DndContext>
		</nav>
	)
}

export default NavigationBar
