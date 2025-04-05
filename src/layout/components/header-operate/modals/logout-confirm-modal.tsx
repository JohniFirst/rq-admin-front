import { Modal } from 'antd'
import type React from 'react'
import { useEffect } from 'react'

interface LogoutConfirmModalProps {
	open: boolean
	onCancel: () => void
	onConfirm: () => void
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
	open,
	onCancel,
	onConfirm,
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!open) return
			if (e.key === 'Enter') {
				onConfirm()
			} else if (e.key === 'Escape') {
				onCancel()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [open, onCancel, onConfirm])

	return (
		<Modal
			open={open}
			title={
				<div className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
					退出确认
				</div>
			}
			onCancel={onCancel}
			onOk={onConfirm}
			okText={
				<div className='flex items-center gap-2'>
					确认退出
					<span className='text-xs opacity-60 border border-current px-1 rounded'>
						Enter
					</span>
				</div>
			}
			cancelText={
				<div className='flex items-center gap-2'>
					取消
					<span className='text-xs opacity-60 border border-current px-1 rounded'>
						Esc
					</span>
				</div>
			}
			className='dark:bg-gray-800'
			width={400}
			centered
			okButtonProps={{
				className:
					'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600',
				danger: true,
			}}
			cancelButtonProps={{
				className: 'hover:bg-gray-100 dark:hover:bg-gray-700',
			}}
		>
			<div className='py-4 text-gray-600 dark:text-gray-300'>
				确定要退出登录吗？
			</div>
		</Modal>
	)
}

export default LogoutConfirmModal
