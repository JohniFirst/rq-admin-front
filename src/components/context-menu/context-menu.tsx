import type React from 'react'
import { useEffect, useRef, useState } from 'react'

export interface ContextMenuItem {
	label: string
	onClick: () => void
	icon?: React.ReactNode
	disabled?: boolean
}

export interface ContextMenuProps {
	menu: ContextMenuItem[]
	children: React.ReactNode
	menuClassName?: string
}

const ContextMenu: React.FC<ContextMenuProps> = ({
	menu,
	children,
	menuClassName,
}) => {
	const [visible, setVisible] = useState(false)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setVisible(false)
			}
		}
		if (visible) {
			document.addEventListener('mousedown', handleClick)
		} else {
			document.removeEventListener('mousedown', handleClick)
		}
		return () => document.removeEventListener('mousedown', handleClick)
	}, [visible])

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault()
		setPosition({ x: e.clientX, y: e.clientY })
		setVisible(true)
	}

	return (
		<div style={{ display: 'inline-block' }} onContextMenu={handleContextMenu}>
			{children}
			{visible && (
				<div
					ref={menuRef}
					className={menuClassName || 'custom-context-menu'}
					style={{
						position: 'fixed',
						top: position.y,
						left: position.x,
						background: '#fff',
						boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
						borderRadius: 4,
						zIndex: 9999,
						minWidth: 120,
						padding: 4,
					}}
				>
					{menu.map((item, idx) => (
						<div
							key={idx}
							className={`context-menu-item${item.disabled ? ' disabled' : ''}`}
							style={{
								padding: '6px 16px',
								cursor: item.disabled ? 'not-allowed' : 'pointer',
								color: item.disabled ? '#aaa' : '#333',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								userSelect: 'none',
							}}
							onClick={() => {
								if (!item.disabled) {
									item.onClick()
									setVisible(false)
								}
							}}
						>
							{item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
							{item.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ContextMenu
