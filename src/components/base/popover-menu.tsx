import { MoreOutlined } from '@ant-design/icons'
import { Button, Popover, message } from 'antd'
import type { HookAPI } from 'antd/es/modal/useModal'
import type { FC } from 'react'
// import LucideIcon from '../lucide-icon'

// 弹出式菜单
const PopoverMenu: FC<{ values: unknown; modal: HookAPI }> = ({ values, modal }) => {
	const Content = () => {
		return (
			<div className='p-0'>
				<Button
					type='text'
					// icon={<LucideIcon size={16} name='file-pen-line' />}
				>
					修 改
				</Button>

				<div className='w-full h-[1px] bg-gray-300 my-1' />

				<Button
					type='text'
					// icon={<LucideIcon size={16} name='trash-2' />}
					danger
					onClick={async () => {
						const confirmed = await modal.confirm({
							title: '确认删除？',
							cancelText: '取消',
							okText: '删除',
						})

						if (!confirmed) return

						// TODO 删除操作的函数
						console.log(values)

						message.success('删除成功')
					}}
				>
					删 除
				</Button>
			</div>
		)
	}

	return (
		<Popover placement='left' trigger='click' title={null} content={Content}>
			<Button type='text' shape='circle' icon={<MoreOutlined />} />
		</Popover>
	)
}

export default PopoverMenu
