import {
  CloseOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FilterOutlined,
  FullscreenOutlined,
  LeftOutlined,
  PicCenterOutlined,
  PushpinOutlined,
  RightOutlined,
  UndoOutlined,
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
import styled from 'styled-components'
import { ContextMenuKey } from '@/enums/system'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setNavItemAction } from '@/store/slice/system-info.ts'

const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  gap: 6px;
  flex-shrink: 0;
  position: relative;
`

const ScrollButton = styled.button`
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover {
    background: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
  }

  &:active {
    background: var(--color-surface-active);
  }
`

const TabList = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const PinIcon = styled(PushpinOutlined)`
  color: var(--color-warning);
  font-size: 12px;
  opacity: 0.8;
`

const TabLabel = styled.span`
  white-space: nowrap;
  font-size: 13px;
  line-height: 1.5;
`

const CloseButton = styled(CloseOutlined)<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  margin-left: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text-disabled)')};
  opacity: 0;
  transform: scale(0.8);

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
    transform: scale(1);
  }
`

const TabItemWrapper = styled.li<{ $isActive: boolean; $isDragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  background: ${props => (props.$isActive ? 'var(--color-surface)' : 'transparent')};
  color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  font-weight: ${props => (props.$isActive ? '500' : '400')};
  position: relative;
  box-shadow: ${props =>
    props.$isActive && !props.$isDragging
      ? '0 2px 8px rgba(59, 130, 246, 0.15), inset 0 0 0 1px var(--color-primary)'
      : 'none'};

  &:hover {
    background: var(--color-surface);
    color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text)')};

    ${CloseButton} {
      opacity: 1;
      transform: scale(1);
    }
  }
`

// 重新加载当前标签页的函数
const reloadCurrentPage = () => {
  const currentPath = window.location.pathname
  window.location.href = currentPath
}

// 全屏切换函数
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 根据是否活跃标签动态生成右键菜单
const getContextMenuItems = (isActive: boolean): MenuProps['items'] => [
  ...(isActive
    ? [
        { label: '重新加载', key: ContextMenuKey.RELOAD, icon: <UndoOutlined /> },
        { label: '全屏显示', key: ContextMenuKey.FULL, icon: <FullscreenOutlined /> },
        { type: 'divider' as const },
      ]
    : []),
  { label: '在新窗口打开', key: ContextMenuKey.OPEN_NEW, icon: <PicCenterOutlined /> },
  { type: 'divider' as const },
  { label: '关闭左侧标签页', key: ContextMenuKey.CLOSE_LEFT, icon: <DoubleLeftOutlined /> },
  { label: '关闭右侧标签页', key: ContextMenuKey.CLOSE_RIGHT, icon: <DoubleRightOutlined /> },
  { label: '关闭其它标签页', key: ContextMenuKey.CLOSE_OTHERS, icon: <FilterOutlined /> },
  { label: '取消/固定到导航栏', key: ContextMenuKey.FIXED, icon: <PushpinOutlined /> },
]

function NavigationBar() {
  let currentClickTarget: NavItem
  const location = useLocation()
  const navgation = useCustomNavigate()
  const navItem = useAppSelector(state => state.systemInfo.navItem)
  const scrollContainerRef = React.useRef<HTMLUListElement>(null)

  // 右键菜单的活跃标签状态
  const [contextMenuActiveKey, setContextMenuActiveKey] = React.useState<string | null>(null)

  // 缓存活跃状态计算结果
  const activeKey = React.useMemo(() => location.pathname, [location.pathname])

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
      case ContextMenuKey.RELOAD:
        reloadCurrentPage()
        break

      case ContextMenuKey.FULL:
        toggleFullscreen()
        break

      case ContextMenuKey.OPEN_NEW:
        window.open(
          window.location.origin +
            import.meta.env.VITE_API_BASE_ROUTER_URL +
            currentClickTarget.key,
        )
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

  const DraggableTabNode = React.memo(
    ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
      const { transform, transition, setNodeRef, attributes, listeners, isDragging } = useSortable({
        id: item.key,
      })

      // 限制拖拽只能水平移动，y 方向始终为 0
      const horizontalTransform = transform
        ? {
            x: transform.x,
            y: 0,
            scaleX: transform.scaleX,
            scaleY: transform.scaleY,
          }
        : undefined

      const style: React.CSSProperties = {
        transform: horizontalTransform ? CSS.Translate.toString(horizontalTransform) : undefined,
        transition,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
      }

      const handleContextMenu = () => {
        currentClickTarget = item
        setContextMenuActiveKey(isActive ? item.key : null)
      }

      return (
        <TabItemWrapper
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          $isActive={isActive}
          $isDragging={isDragging}
          onClick={() => navgation(item.key)}
          onContextMenu={handleContextMenu}
        >
          {item.fixed && <PinIcon />}
          <TabLabel>{item.label}</TabLabel>
          <CloseButton $isActive={isActive} onClick={e => closeCurrentNav(e, item)} />
        </TabItemWrapper>
      )
    },
  )
  DraggableTabNode.displayName = 'DraggableTabNode'

  return (
    <NavigationContainer>
      <ScrollButton type="button" onClick={() => handleScroll('left')}>
        <LeftOutlined />
      </ScrollButton>
      <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={navItem.map(i => i.key)} strategy={horizontalListSortingStrategy}>
          <Dropdown
            menu={{
              items: getContextMenuItems(activeKey === contextMenuActiveKey),
              onClick: handleMenuClick,
            }}
            trigger={['contextMenu']}
          >
            <TabList ref={scrollContainerRef}>
              {navItem.map(item => (
                <DraggableTabNode key={item.key} item={item} isActive={activeKey === item.key} />
              ))}
            </TabList>
          </Dropdown>
        </SortableContext>
      </DndContext>
      <ScrollButton type="button" onClick={() => handleScroll('right')}>
        <RightOutlined />
      </ScrollButton>
    </NavigationContainer>
  )
}

export default NavigationBar
