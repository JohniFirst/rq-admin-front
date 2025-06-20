import { Modal as AntdModal, Button, Modal, Space, Tag, message } from 'antd'
import type React from 'react'

interface DetailModalProps {
	event: any
	eventRepeatOptions: Record<string, string>
	open: boolean
	onEdit: () => void
	onCancel: () => void
	// occurrenceDate: 当前 occurrence 的日期（如为单次删除需传递）
	occurrenceDate?: Date
	// onDelete: (mode: 'single' | 'all' | 'future', occurrenceDate?: Date) => void
	onDelete?: (mode: 'single' | 'all' | 'future', occurrenceDate?: Date) => void
}

const DetailModal: React.FC<DetailModalProps> = ({
	event,
	eventRepeatOptions,
	open,
	onEdit,
	onCancel,
	occurrenceDate,
	onDelete,
}) => {
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
					if (typeof onDelete === 'function') onDelete('single', occurrenceDate)
					onCancel()
				},
				onCancel: () => {},
				footer: [
					<Button
						key='single'
						onClick={() => {
							if (typeof onDelete === 'function')
								onDelete('single', occurrenceDate)
							onCancel()
						}}
					>
						仅删除本次
					</Button>,
					<Button
						key='future'
						onClick={() => {
							if (typeof onDelete === 'function')
								onDelete('future', occurrenceDate)
							onCancel()
						}}
					>
						本次及后续
					</Button>,
					<Button
						key='all'
						danger
						onClick={() => {
							if (typeof onDelete === 'function') onDelete('all')
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
					if (typeof onDelete === 'function') onDelete('all')
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
					<h3>{event.title}</h3>
					<p>
						<strong>开始时间：</strong>
						{event.start?.toLocaleString()}
					</p>
					<p>
						<strong>结束时间：</strong>
						{event.end?.toLocaleString()}
					</p>
					{event.description && (
						<p>
							<strong>描述：</strong>
							{event.description}
						</p>
					)}
					<p>
						<strong>重复：</strong>
						{eventRepeatOptions[event.extendedProps?.repeat ?? 'none']}
					</p>
					<p>
						<strong>提醒：</strong>
						{event.extendedProps?.reminder ? '开启' : '关闭'}
					</p>
					<div className='event-color'>
						<strong>事件颜色：</strong>
						<Tag color={event.backgroundColor as string}>
							{event.backgroundColor}
						</Tag>
					</div>
				</div>
			)}
		</Modal>
	)
}

export default DetailModal
// 父组件 onDelete 处理建议：
// - mode === 'single'：将 occurrenceDate 加入 exdate
// - mode === 'all'：直接删除事件
// - mode === 'future'：将 rrule.until 设为 occurrenceDate 前一天
