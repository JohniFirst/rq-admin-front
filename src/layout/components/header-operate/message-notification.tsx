import { BellOutlined } from '@ant-design/icons'
import { Badge, Button, Popover, Tabs, type TabsProps } from 'antd'
import type React from 'react'
import { useState } from 'react'

interface MessageNotificationProps {
	unreadMessages: number
}

type MessageNotificationTab = 'unread' | 'read'

const MessageNotification: React.FC<MessageNotificationProps> = ({
	unreadMessages,
}) => {
	const [activeTab, setActiveTab] = useState<MessageNotificationTab>('unread')

	const handleTabChange = (key: string) => {
		setActiveTab(key as MessageNotificationTab)
	}

	const handleMarkAllAsRead = () => {
		setActiveTab('read')
	}

	const items: TabsProps['items'] = [
		{
			key: 'unread',
			label: (
				<span className='flex items-center gap-2'>
					<span className='text-red-500'>未读消息</span>
					{unreadMessages > 0 && (
						<span className='px-2 py-0.5 text-xs bg-red-100 text-red-500 rounded-full'>
							{unreadMessages}
						</span>
					)}
				</span>
			),
			children: (
				<div className='space-y-4'>
					<div className='space-y-4 max-h-[300px] overflow-y-auto pr-2'>
						{[...Array(3)].map((_, index) => (
							<div
								key={`unread-${index}`}
								className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer'
							>
								<div className='flex items-start gap-3'>
									<div className='w-2 h-2 mt-2 rounded-full bg-blue-500' />
									<div className='flex-1'>
										<h4 className='text-sm font-medium text-gray-800 dark:text-gray-200'>
											系统通知
										</h4>
										<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
											这是一条未读的系统通知消息示例
										</p>
										<span className='text-xs text-gray-400 dark:text-gray-500 mt-2 block'>
											2分钟前
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
					<Button
						type='primary'
						onClick={handleMarkAllAsRead}
						className='w-full bg-indigo-600 hover:bg-indigo-700 border-none shadow-md hover:shadow-lg transition-all duration-300'
					>
						全部标记为已读
					</Button>
				</div>
			),
		},
		{
			key: 'read',
			label: <span className='text-gray-500'>已读消息</span>,
			children: (
				<div className='space-y-4 max-h-[300px] overflow-y-auto pr-2'>
					{[...Array(5)].map((_, index) => (
						<div
							key={`read-${index}`}
							className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60 transition-all duration-300'
						>
							<div className='flex items-start gap-3'>
								<div className='w-2 h-2 mt-2 rounded-full bg-gray-400' />
								<div className='flex-1'>
									<h4 className='text-sm font-medium text-gray-800 dark:text-gray-200'>
										系统通知
									</h4>
									<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
										这是一条已读的系统通知消息示例
									</p>
									<span className='text-xs text-gray-400 dark:text-gray-500 mt-2 block'>
										2天前
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			),
		},
	]

	return (
		<div>
			<Popover
				title={
					<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
						消息中心
					</h3>
				}
				trigger='click'
				content={
					<Tabs
						className='w-[400px]'
						defaultActiveKey={activeTab}
						items={items}
						onChange={handleTabChange}
					/>
				}
				placement='bottomRight'
				overlayClassName='notification-popover'
			>
				<Badge
					count={unreadMessages}
					size='small'
					className='cursor-pointer transform hover:scale-110 transition-all duration-300'
				>
					<BellOutlined className='text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300' />
				</Badge>
			</Popover>
		</div>
	)
}

export default MessageNotification
