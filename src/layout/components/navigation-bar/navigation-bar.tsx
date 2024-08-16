import { Dropdown, Modal, type MenuProps } from 'antd'
import {
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FilterOutlined,
  PicCenterOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import { cloneDeep } from 'lodash-es'
import { useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setNavItemAction } from '@/store/slice/system-info.ts'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { ContextMenuKey } from '@/enums/system'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DragEndEvent } from '@dnd-kit/core'

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
        newNavItem[clickIndex].fixed = newNavItem[clickIndex].fixed
          ? false
          : true

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

  /**
   * Updates the current click target to the provided item.
   *
   * @param {NavItem} item - The item to set as the current click target.
   * @return {void} This function does not return anything.
   */
  const navContentMenu = (item: NavItem) => {
    currentClickTarget = item
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
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`${
          location.pathname === item.key
            ? 'bg-sky-50 text-blue-500 border-blue-500 border-x border-y'
            : ''
        } cursor-pointer dark:bg-[#242424] bg-white py-1 px-3 rounded-md shrink-0`}
        onClick={() => navgation(item.key)}
        key={item.key}
        onContextMenu={() => navContentMenu(item)}
      >
        {item.fixed ? <PushpinOutlined className="text-red-500" /> : ''}
        {item.label}{' '}
        <CloseOutlined
          onClick={(e) => closeCurrentNav(e, item)}
          className="text-xs text-gray-400 hover:text-blue-600"
        />
      </li>
    )
  }

  return (
    <Dropdown
      menu={{ items: contextMenu, onClick: handleMenuClick }}
      trigger={['contextMenu']}
    >
      <ul className="flex gap-2 dark:bg-black bg-gray-50 py-2">
        <DndContext
          sensors={[sensor]}
          onDragEnd={onDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={navItem.map((i) => i.key)}
            strategy={horizontalListSortingStrategy}
          >
            {navItem.map((item) => (
              <DraggableTabNode key={item.key} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
    </Dropdown>
  )
}

export default NavigationBar
