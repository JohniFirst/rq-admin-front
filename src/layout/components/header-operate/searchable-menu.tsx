import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppSelector } from '@/store/hooks'
import {
	DownOutlined,
	EnterOutlined,
	SearchOutlined,
	UpOutlined,
} from '@ant-design/icons'
import { Input, Modal } from 'antd'
import type { InputRef } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import system from './css/system.module.css'

/** 菜单搜索的底部提示 */
const SearchMenuFooter: FC = () => {
	return (
		<div className='flex justify-end gap-6'>
			<p>
				<span className='searchable-menu-icon-wp'>
					<DownOutlined />
				</span>
				&nbsp;
				<span className='searchable-menu-icon-wp'>
					<UpOutlined />
				</span>
				上下导航
			</p>
			<p>
				<span className='searchable-menu-icon-wp'>
					<EnterOutlined />
				</span>
				选择
			</p>
			<p>
				<span className='searchable-menu-icon-wp'>ESC</span>
				退出
			</p>
		</div>
	)
}

const SearchableMenu: FC = () => {
	const [searchText, setSearchText] = useState('')
	const menuItems = useAppSelector((state) => state.menu)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const inputRef = useRef<InputRef>(null)
	const navigate = useCustomNavigate()

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === 'm') {
				setIsModalOpen(true)
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const findMatchingItems = (arr: MenuItem[], keyword: string): MenuItem[] => {
		if (keyword === '') {
			return []
		}

		function checkLabel(arr: MenuItem[]) {
			const tempResult: MenuItem[] = []
			arr.forEach((item) => {
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
			})

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
			>
				{item.label.split('').map((labelItem: string) => {
					return (
						<span
							key={labelItem}
							style={{ color: searchText.includes(labelItem) ? 'red' : '' }}
						>
							{labelItem}
						</span>
					)
				})}
			</p>
		)
	}

	const content = useMemo(() => {
		const filterResult = findMatchingItems(menuItems, searchText)
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
	}, [searchText])

	return (
		<>
			<Input
				prefix={<SearchOutlined />}
				onFocus={() => setIsModalOpen(true)}
				placeholder='ctrl + m 搜索菜单'
			/>

			<Modal
				open={isModalOpen}
				closeIcon={null}
				footer={<SearchMenuFooter />}
				onCancel={() => setIsModalOpen(false)}
				focusTriggerAfterClose={false}
				wrapClassName='max-h-[500px]'
				afterOpenChange={(open) => {
					if (open) {
						inputRef.current?.focus({
							cursor: 'all',
						})
					}
				}}
			>
				<Input
					ref={inputRef}
					onChange={(event) => setSearchText(event.target.value)}
					prefix={<SearchOutlined />}
					placeholder='输入菜单名'
				/>
				{content}
			</Modal>
		</>
	)
}

export default SearchableMenu
