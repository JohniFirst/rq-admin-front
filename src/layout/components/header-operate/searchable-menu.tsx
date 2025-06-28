import { DownOutlined, EnterOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import system from './css/system.module.css'

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
        <div
          key={item.key}
          className={system.filterMenuWp}
          style={{ marginLeft: `${indent * 16}px` }}
        >
          <p>{item.title || item.label}</p>
          {item.children.map((child: MenuItem, childIndex: number) => (
            <FilterResultItem
              key={child.key}
              item={child}
              indent={indent + 1}
              index={index + childIndex + 1}
            />
          ))}
        </div>
      )
    }
    const displayText = (item.title || item.label || '').toString()
    return (
      <p
        key={item.key}
        className={`${system.filterMenuItem} ${index === selectedIndex ? 'bg-indigo-500 text-white' : ''}`}
        style={{ marginLeft: `${indent * 16}px` }}
        onClick={() => filterNav(item)}
        onKeyUp={() => filterNav(item)}
        data-index={index}
      >
        {displayText.split('').map((char: string, i: number) => {
          const isCharMatch = searchValue.toLowerCase().includes(char.toLowerCase())
          return (
            <span
              key={i}
              style={{ color: isCharMatch ? 'inherit' : '' }}
              className={isCharMatch ? 'font-bold' : ''}
            >
              {char}
            </span>
          )
        })}
      </p>
    )
  }

  const content = useMemo(() => {
    const filterResult = findMatchingItems(menuItems, searchValue)
    return (
      <div className="mt-2 min-h-2" ref={searchResultsRef}>
        {filterResult.length ? (
          filterResult.map((item, index) => {
            return <FilterResultItem key={item.key} item={item} index={index} />
          })
        ) : (
          <p className="my-4 ml-7">无匹配项</p>
        )}
      </div>
    )
  }, [searchValue, selectedIndex])

  return (
    <>
      <motion.div
        className="cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={showModal}
      >
        <SearchOutlined className="text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300" />
      </motion.div>

      <Modal
        title={
          <div className="flex items-center gap-3">
            <SearchOutlined className="text-xl text-indigo-600" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">菜单搜索</span>
          </div>
        }
        open={isModalOpen}
        footer={
          <div className="flex justify-end gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <DownOutlined />
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <UpOutlined />
              </span>
              上下导航
            </p>
            <p className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <EnterOutlined />
              </span>
              选择
            </p>
            <p className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">ESC</span>
              退出
            </p>
          </div>
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
        <div className="space-y-6">
          <Input
            placeholder="输入关键字搜索菜单 (Ctrl + M)"
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            className="py-3 pl-12 pr-4 text-lg rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300"
            autoFocus
          />

          <AnimatePresence>
            {searchValue && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-2"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">搜索结果</div>
                {content}
              </motion.div>
            )}
          </AnimatePresence>

          {!searchValue && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>使用快捷键 Ctrl + M 快速打开搜索</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default SearchableMenu
