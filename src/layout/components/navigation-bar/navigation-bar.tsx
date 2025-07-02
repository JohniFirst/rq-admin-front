import {
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FilterOutlined,
  LeftOutlined,
  PicCenterOutlined,
  PushpinOutlined,
  RightOutlined,
} from '@ant-design/icons'
import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, PointerSensor, useSensor } from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Dropdown, type MenuProps, Modal } from 'antd'
import { cloneDeep } from 'lodash-es'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { ContextMenuKey } from '@/enums/system'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setNavItemAction } from '@/store/slice/system-info.ts'

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
  const navItem = useAppSelector(state => state.systemInfo.navItem)
  const scrollContainerRef = React.useRef<HTMLUListElement>(null)

  const dispatch = useAppDispatch()
  const setNavItem = (navItem: NavItem[]) => {
    dispatch(setNavItemAction(navItem))
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 // 每次滚动的像素
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll =
        direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      })
    }
  }

  /**
   * Handles the click event on the menu.
   *
   * @param {MenuProps["onClick"]} e - The click event object.
   * @return {void} This function does not return anything.
   */
  const handleMenuClick: MenuProps['onClick'] = e => {
    const clickIndex = navItem.findIndex(item => item.key === currentClickTarget.key)
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
        setNavItem(navItem.filter(item => item.key === currentClickTarget.key || item.fixed))
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
  const closeCurrentNav = async (e: React.MouseEvent<HTMLElement, MouseEvent>, item: NavItem) => {
    e.stopPropagation()

    if (item.fixed) {
      Modal.warning({
        title: '提示',
        content: '当前标签页固定到导航栏，是否关闭?',
        okText: '关闭',
        okCancel: true,
        cancelText: '取消',
        onOk: () => {
          setNavItem(navItem.filter(nav => nav.key !== item.key))
        },
      })

      return
    }

    setNavItem(navItem.filter(nav => nav.key !== item.key))
  }

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  })

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const temp = (() => {
        const activeIndex = navItem.findIndex(i => i.key === active.id)
        const overIndex = navItem.findIndex(i => i.key === over?.id)
        return arrayMove(navItem, activeIndex, overIndex)
      })()
      setNavItem(temp)
    }
  }

  const DraggableTabNode = ({ item }: { item: NavItem }) => {
    const { transform, transition, setNodeRef, attributes, listeners } = useSortable({
      id: item.key,
    })

    const style: React.CSSProperties = {
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: 'move',
    }

    const isActive = location.pathname === item.key

    return (
      <li
        key={item.key + '1'}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`
          group relative flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer select-none
          transition-all duration-200 ease-in-out bg-background
          ${isActive ? 'text-primary font-medium border-b-2 border-primary' : 'text-text-secondary hover:bg-surface'}
        `}
        onClick={() => navgation(item.key)}
        onContextMenu={() => (currentClickTarget = item)}
      >
        {item.fixed && <PushpinOutlined className="text-primary text-xs" />}
        <span className="whitespace-nowrap">{item.label}</span>
        <CloseOutlined
          className={`
            ml-1 text-xs p-1 rounded hover:rounded-full
            transition-all duration-200
            ${isActive ? 'text-primary hover:bg-primary/10' : 'text-text-disabled hover:text-text-secondary hover:bg-surface-hover'}
          `}
          onClick={e => closeCurrentNav(e, item)}
        />
      </li>
    )
  }

  return (
    <nav className="flex items-center px-4 py-2 bg-background border-b border-border">
      <button
        type="button"
        onClick={() => handleScroll('left')}
        className="p-1 hover:bg-surface rounded-md transition-colors"
      >
        <LeftOutlined />
      </button>
      <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={navItem.map(i => i.key)} strategy={horizontalListSortingStrategy}>
          <Dropdown
            menu={{ items: contextMenu, onClick: handleMenuClick }}
            trigger={['contextMenu']}
          >
            <ul
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {navItem.map(item => (
                <DraggableTabNode key={item.key} item={item} />
              ))}
            </ul>
          </Dropdown>
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={() => handleScroll('right')}
        className="p-1 hover:bg-surface rounded-md transition-colors"
      >
        <RightOutlined />
      </button>
    </nav>
  )
}

export default NavigationBar
