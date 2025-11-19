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
  padding: 0.5rem 1rem;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  gap: 0.5rem;
  flex-shrink: 0;
`

const ScrollButton = styled.button`
  padding: 0.25rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--color-surface);
    color: var(--color-text);
  }
`

const TabList = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const TabItem = styled.li<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease;
  background: ${props => (props.$isActive ? 'var(--color-surface)' : 'var(--color-background)')};
  color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  font-weight: ${props => (props.$isActive ? '500' : '400')};
  border-bottom: 2px solid ${props => (props.$isActive ? 'var(--color-primary)' : 'transparent')};

  &:hover {
    background: var(--color-surface);
    color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text)')};
  }
`

const PinIcon = styled(PushpinOutlined)`
  color: var(--color-primary);
  font-size: 0.75rem;
`

const TabLabel = styled.span`
  white-space: nowrap;
`

const CloseButton = styled(CloseOutlined)<{ $isActive: boolean }>`
  margin-left: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text-disabled)')};

  &:hover {
    border-radius: 50%;
    background: ${props =>
      props.$isActive ? 'rgba(102, 126, 234, 0.1)' : 'var(--color-surface-hover)'};
    color: ${props => (props.$isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  }
`

const contextMenu: MenuProps['items'] = [
  {
    label: '重新加载（TODO）',
    key: ContextMenuKey.RELOAD,
    icon: <UndoOutlined />,
  },
  {
    label: '最大化显示（TODO）',
    key: ContextMenuKey.FULL,
    icon: <FullscreenOutlined />,
  },
  {
    type: 'divider',
  },
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
      <TabItem
        key={item.key + '1'}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        $isActive={isActive}
        onClick={() => navgation(item.key)}
        onContextMenu={() => (currentClickTarget = item)}
      >
        {item.fixed && <PinIcon />}
        <TabLabel>{item.label}</TabLabel>
        <CloseButton $isActive={isActive} onClick={e => closeCurrentNav(e, item)} />
      </TabItem>
    )
  }

  return (
    <NavigationContainer>
      <ScrollButton type="button" onClick={() => handleScroll('left')}>
        <LeftOutlined />
      </ScrollButton>
      <DndContext sensors={[sensor]} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={navItem.map(i => i.key)} strategy={horizontalListSortingStrategy}>
          <Dropdown
            menu={{ items: contextMenu, onClick: handleMenuClick }}
            trigger={['contextMenu']}
          >
            <TabList ref={scrollContainerRef}>
              {navItem.map(item => (
                <DraggableTabNode key={item.key} item={item} />
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
