import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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

const DivWp = styled.div<{ position?: { x: number; y: number } }>`
	position: fixed;
	top: ${(props) => props.position?.y || 0}px;
	left: ${(props) => props.position?.x || 0}px;
	background: #fff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	z-index: 9999;
	min-width: 120px;
	padding: 4px;
`

const ContextMenuItemStyled = styled.div<{ disabled?: boolean }>`
	padding: 6px 16px;
	cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
	color: ${(props) => (props.disabled ? '#aaa' : '#333')};
	display: flex;
	align-items: center;
	gap: 8px;
	user-select: none;
	&:hover {
		background-color: ${(props) => (props.disabled ? 'transparent' : '#f0f0f0')};
	}
	&.disabled {
		cursor: not-allowed;
	}
`

const ContextMenu: React.FC<ContextMenuProps> = ({ menu, children, menuClassName }) => {
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
				<DivWp ref={menuRef} className={menuClassName || 'custom-context-menu'} position={position}>
					{menu.map((item, idx) => (
						<ContextMenuItemStyled
							key={idx}
							className={`context-menu-item${item.disabled ? ' disabled' : ''}`}
							disabled={item.disabled}
							onClick={() => {
								if (!item.disabled) {
									item.onClick()
									setVisible(false)
								}
							}}
						>
							{item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
							{item.label}
						</ContextMenuItemStyled>
					))}
				</DivWp>
			)}
		</div>
	)
}

export default ContextMenu
