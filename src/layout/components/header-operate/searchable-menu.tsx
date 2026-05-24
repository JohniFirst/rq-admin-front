import { DownOutlined, EnterOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import { headerButtonBase } from './styles'

const FilterMenuWp = styled.div<{ indent: number }>`
  background-color: #fff2e5;
  margin-bottom: 28px;
  padding: 8px;
  border-radius: 8px;
  margin-left: ${props => props.indent * 16}px;
`

const FilterMenuItem = styled.p<{ indent: number; $isSelected?: boolean }>`
  cursor: pointer;
  color: var(--theme-color);
  padding: 4px 0 4px 4px;
  width: calc(100% - 26px);
  border-radius: 8px;
  margin-left: ${props => props.indent * 16}px;
  background: ${props => (props.$isSelected ? 'var(--color-primary)' : 'transparent')};
  color: ${props => (props.$isSelected ? '#fff' : 'var(--theme-color)')};
`

const SearchButton = styled.button`
  ${headerButtonBase}
  padding: 0;
`

const SearchResultsContainer = styled.div`
  margin-top: 8px;
  min-height: 8px;
`

const NoMatchText = styled.p`
  margin: 16px 0 16px 28px;
`

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ModalTitleText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
`

const ShortcutKey = styled.span`
  padding: 2px 8px;
  background: var(--color-surface);
  border-radius: 4px;
`

const ShortcutItem = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const SearchInput = styled(Input)`
  padding: 12px 16px;
  font-size: 18px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--color-primary);
  }
`

const AnimatedContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SearchResultsTitle = styled.div`
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
`

const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
`

const MatchChar = styled.span<{ $isMatch: boolean }>`
  font-weight: ${props => (props.$isMatch ? 'bold' : 'normal')};
`

const SearchableMenu: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuItems = useAppSelector(state => state.menu)
  const navigate = useCustomNavigate()
  const searchResultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        setIsModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return

      const filterResult = findMatchingItems(menuItems, searchValue)
      const flattenedItems = flattenMenuItems(filterResult)

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev < flattenedItems.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          event.preventDefault()
          if (flattenedItems[selectedIndex]) {
            filterNav(flattenedItems[selectedIndex].key)
          }
          break
        case 'Escape':
          event.preventDefault()
          handleCancel()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, searchValue, selectedIndex])

  useEffect(() => {
    if (searchResultsRef.current) {
      const selectedElement = searchResultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      )
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  const showModal = () => {
    setIsModalOpen(true)
    setSelectedIndex(0)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSearchValue('')
    setSelectedIndex(0)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setSelectedIndex(0)
  }

  const findMatchingItems = (arr: MenuItem[], keyword: string): MenuItem[] => {
    if (keyword === '') {
      return []
    }

    function checkLabel(arr: MenuItem[]) {
      const tempResult: MenuItem[] = []

      for (const item of arr) {
        if (item.children) {
          const childrenLableIncludesKeyword = checkLabel(item.children)
          if (childrenLableIncludesKeyword.length) {
            tempResult.push({
              ...item,
              children: childrenLableIncludesKeyword,
            })
          }
        } else {
          const searchText = (item.title || item.label || '').toString().toLowerCase()
          if (searchText.includes(keyword.toLowerCase())) {
            tempResult.push({
              ...item,
              key: item.url || item.key,
            })
          }
        }
      }

      return tempResult
    }

    return checkLabel(arr)
  }

  const flattenMenuItems = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = []
    const flatten = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.children) {
          flatten(item.children)
        } else {
          result.push(item)
        }
      }
    }
    flatten(items)
    return result
  }

  const filterNav = (key: string | { key: string; url?: string }) => {
    setIsModalOpen(false)
    let targetKey = typeof key === 'string' ? key : key.key
    if (typeof key !== 'string' && key.url) {
      targetKey = key.url
    }
    if (targetKey && typeof targetKey === 'string') {
      navigate(targetKey)
    }
  }

  const FilterResultItem: FC<{
    item: MenuItem
    indent?: number
    index: number
  }> = ({ item, indent = 0, index }) => {
    if (item.children) {
      return (
        <FilterMenuWp indent={indent} key={item.key}>
          <p>{item.title || item.label}</p>
          {item.children.map((child: MenuItem, childIndex: number) => (
            <FilterResultItem
              key={child.key}
              item={child}
              indent={indent + 1}
              index={index + childIndex + 1}
            />
          ))}
        </FilterMenuWp>
      )
    }
    const displayText = (item.title || item.label || '').toString()
    return (
      <FilterMenuItem
        key={item.key}
        indent={indent}
        $isSelected={index === selectedIndex}
        onClick={() => filterNav(item)}
        onKeyUp={() => filterNav(item)}
        data-index={index}
      >
        {displayText.split('').map((char: string, i: number) => {
          const isCharMatch = searchValue.toLowerCase().includes(char.toLowerCase())
          return (
            <MatchChar key={i} $isMatch={isCharMatch}>
              {char}
            </MatchChar>
          )
        })}
      </FilterMenuItem>
    )
  }

  const content = useMemo(() => {
    const filterResult = findMatchingItems(menuItems, searchValue)
    return (
      <SearchResultsContainer ref={searchResultsRef}>
        {filterResult.length ? (
          filterResult.map((item, index) => {
            return <FilterResultItem key={item.key} item={item} index={index} />
          })
        ) : (
          <NoMatchText>无匹配项</NoMatchText>
        )}
      </SearchResultsContainer>
    )
  }, [searchValue, selectedIndex])

  return (
    <>
      <SearchButton onClick={showModal} title="菜单搜索 (Ctrl+M)">
        <SearchOutlined style={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
      </SearchButton>

      <Modal
        title={
          <ModalTitle>
            <SearchOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />
            <ModalTitleText>菜单搜索</ModalTitleText>
          </ModalTitle>
        }
        open={isModalOpen}
        footer={
          <ModalFooter>
            <ShortcutItem>
              <ShortcutKey>
                <DownOutlined />
              </ShortcutKey>
              <ShortcutKey>
                <UpOutlined />
              </ShortcutKey>
              上下导航
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutKey>
                <EnterOutlined />
              </ShortcutKey>
              选择
            </ShortcutItem>
            <ShortcutItem>
              <ShortcutKey>ESC</ShortcutKey>
              退出
            </ShortcutItem>
          </ModalFooter>
        }
        onCancel={handleCancel}
        className="searchable-menu-modal"
        width={600}
        afterOpenChange={visible => {
          if (visible) {
            setTimeout(() => {
              const input = document.querySelector(
                '.searchable-menu-modal input',
              ) as HTMLInputElement
              input?.focus()
            }, 100)
          }
        }}
      >
        <InputWrapper>
          <SearchInput
            placeholder="输入关键字搜索菜单 (Ctrl + M)"
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            autoFocus
          />

          <AnimatePresence>
            {searchValue && (
              <AnimatedContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <SearchResultsTitle>搜索结果</SearchResultsTitle>
                {content}
              </AnimatedContent>
            )}
          </AnimatePresence>

          {!searchValue && (
            <EmptyState>
              <p>使用快捷键 Ctrl + M 快速打开搜索</p>
            </EmptyState>
          )}
        </InputWrapper>
      </Modal>
    </>
  )
}

export default SearchableMenu
