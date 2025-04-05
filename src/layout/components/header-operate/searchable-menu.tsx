import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import {
	DownOutlined,
	EnterOutlined,
	SearchOutlined,
	UpOutlined,
} from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'
import system from './css/system.module.css'

const SearchableMenu: FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const menuItems = useAppSelector((state) => state.menu)
	const navigate = useCustomNavigate()

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === 'm') {
				setIsModalOpen(true)
			}
		}

		document.addEventListener('keydown', handleKeyPress)
		return () => document.removeEventListener('keydown', handleKeyPress)
	}, [])

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
		setSearchValue('')
	}

	const handleSearch = (value: string) => {
		setSearchValue(value)
		// 实现搜索逻辑
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
					if (item.label.includes(keyword)) {
						tempResult.push(item)
					}
				}
			}

			return tempResult
		}

		return checkLabel(arr)
	}

	const filterNav = (key: string) => {
		setIsModalOpen(false)
		navigate(key)
	}

	const FilterResultItem: FC<{ item: MenuItem; indent?: number }> = ({
		item,
		indent = 0,
	}) => {
		if (item.children) {
			return (
				<div
					key={item.key}
					className={system.filterMenuWp}
					style={{ marginLeft: `${indent * 16}px` }}
				>
					<p>{item.label}</p>
					{item.children.map((child: MenuItem) => (
						<FilterResultItem
							key={child.key}
							item={child}
							indent={indent + 1}
						/>
					))}
				</div>
			)
		}
		return (
			<p
				key={item.key}
				className={system.filterMenuItem}
				style={{ marginLeft: `${indent * 16}px` }}
				onClick={() => filterNav(item.key)}
				onKeyUp={() => filterNav(item.key)}
			>
				{item.label.split('').map((labelItem: string) => {
					return (
						<span
							key={labelItem}
							style={{ color: searchValue.includes(labelItem) ? 'red' : '' }}
						>
							{labelItem}
						</span>
					)
				})}
			</p>
		)
	}

	const content = useMemo(() => {
		const filterResult = findMatchingItems(menuItems, searchValue)
		return (
			<div className='mt-2 min-h-2'>
				{filterResult.length ? (
					filterResult.map((item) => {
						return <FilterResultItem key={item.key} item={item} />
					})
				) : (
					<p className='my-4 ml-7'>无匹配项</p>
				)}
			</div>
		)
	}, [searchValue])

	return (
		<>
			<motion.div
				className='cursor-pointer'
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={showModal}
			>
				<SearchOutlined className='text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300' />
			</motion.div>

			<Modal
				title={
					<div className='flex items-center gap-3'>
						<SearchOutlined className='text-xl text-indigo-600' />
						<span className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
							菜单搜索
						</span>
					</div>
				}
				open={isModalOpen}
				footer={
					<div className='flex justify-end gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700'>
						<p className='flex items-center gap-2'>
							<span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded'>
								<DownOutlined />
							</span>
							<span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded'>
								<UpOutlined />
							</span>
							上下导航
						</p>
						<p className='flex items-center gap-2'>
							<span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded'>
								<EnterOutlined />
							</span>
							选择
						</p>
						<p className='flex items-center gap-2'>
							<span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded'>
								ESC
							</span>
							退出
						</p>
					</div>
				}
				onCancel={handleCancel}
				className='searchable-menu-modal'
				width={600}
			>
				<div className='space-y-6'>
					<div className='relative'>
						<Input
							placeholder='输入关键字搜索菜单 (Ctrl + M)'
							value={searchValue}
							onChange={(e) => handleSearch(e.target.value)}
							className='py-3 pl-12 pr-4 text-lg rounded-lg border-2 border-gray-200 focus:border-indigo-500 transition-all duration-300'
							autoFocus
						/>
						<SearchOutlined className='absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400' />
					</div>

					<AnimatePresence>
						{searchValue && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								className='space-y-2'
							>
								<div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
									搜索结果
								</div>
								{content}
							</motion.div>
						)}
					</AnimatePresence>

					{!searchValue && (
						<div className='text-center text-gray-500 dark:text-gray-400'>
							<p>使用快捷键 Ctrl + M 快速打开搜索</p>
						</div>
					)}
				</div>
			</Modal>
		</>
	)
}

export default SearchableMenu
