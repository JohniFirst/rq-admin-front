import ContextMenu, {
	type ContextMenuItem,
} from '@/components/context-menu/context-menu'
import { Button } from 'antd'
import type React from 'react'

const menu: ContextMenuItem[] = [
	{ label: '编辑', onClick: () => alert('编辑') },
	{ label: '删除', onClick: () => alert('删除') },
	{ label: '禁用项', onClick: () => {}, disabled: true },
]

const ContextMenuDemo: React.FC = () => {
	return (
		<div style={{ padding: 40 }}>
			<h2>右键菜单组件示例</h2>
			<ContextMenu menu={menu}>
				<div
					style={{
						width: 300,
						height: 120,
						border: '1px dashed #aaa',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 16,
					}}
				>
					右键点击这里试试
				</div>
			</ContextMenu>

			<div style={{ marginTop: 32 }}>
				<ContextMenu menu={menu}>
					<Button type='primary'>右键点击这个按钮</Button>
				</ContextMenu>
			</div>
		</div>
	)
}

export default ContextMenuDemo
