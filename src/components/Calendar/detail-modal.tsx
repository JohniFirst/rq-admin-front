import { Modal as AntdModal, Button, Modal, message, Space, Tag } from 'antd'
import type React from 'react'
import { eventRepeatOptions } from './event-modal'

interface DetailModalProps {
	event: any
	open: boolean
	onEdit: () => void
	onCancel: () => void
}

const DetailModal: React.FC<DetailModalProps> = ({ event, open, onEdit, onCancel }) => {
	const handleEdit = () => {
		onEdit()
	}
	const handleDelete = () => {
		if (event.rrule) {
			AntdModal.confirm({
				title: '删除重复事件',
				content: (
					<div>
						<p>这是一个重复事件，请选择删除方式：</p>
						<ul>
							<li>
								<b>仅删除本次：</b> 只删除本 occurrence，不影响其他
							</li>
							<li>
								<b>删除全部：</b> 删除所有 occurrence
							</li>
							<li>
								<b>本次及后续：</b> 删除本 occurrence 及之后所有 occurrence
							</li>
						</ul>
					</div>
				),
				okText: '仅删除本次',
				cancelText: '取消',
				onOk: () => {
					onCancel()
				},
				onCancel: () => {},
				footer: [
					<Button
						key='single'
						onClick={() => {
							onCancel()
						}}
					>
						仅删除本次
					</Button>,
					<Button
						key='future'
						onClick={() => {
							onCancel()
						}}
					>
						本次及后续
					</Button>,
					<Button
						key='all'
						danger
						onClick={() => {
							onCancel()
						}}
					>
						删除全部
					</Button>,
				],
			})
		} else {
			AntdModal.confirm({
				title: '确认删除',
				content: '确定要删除这个事件吗？',
				onOk: () => {
					message.success('事件已删除')
					onCancel()
				},
			})
		}
	}

	return (
		<Modal
			title='事件详情'
			open={open}
			onCancel={onCancel}
			footer={
				<div className='event-actions'>
					<Space>
						<Button onClick={handleEdit}>编辑</Button>
						<Button danger onClick={handleDelete}>
							删除
						</Button>
					</Space>
				</div>
			}
		>
			{event && (
				<div className='event-detail'>
					<h3>{event.title || ''}</h3>
					<p>
						<strong>开始时间：</strong>
						{event.start ? event.start.toLocaleString() : ''}
					</p>
					<p>
						<strong>结束时间：</strong>
						{event.end ? event.end.toLocaleString() : ''}
					</p>
					{event.description && (
						<p>
							<strong>描述：</strong>
							{event.description || ''}
						</p>
					)}
					<p>
						<strong>重复：</strong>
						{eventRepeatOptions[event.extendedProps?.repeat ?? 'none']?.label || '不重复'}
					</p>
					<p>
						<strong>提醒：</strong>
						{event.extendedProps?.reminder ? '开启' : '关闭'}
					</p>
					<div className='event-color'>
						<strong>事件颜色：</strong>
						<Tag color={event.backgroundColor || '#000'}>{event.backgroundColor || ''}</Tag>
					</div>
				</div>
			)}
		</Modal>
	)
}

export default DetailModal
