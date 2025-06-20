import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface SquareInputBoxProps {
	/** 验证码长度，默认为6 */
	length?: number
	/** 输入框大小，默认为48px */
	size?: number
	/** 输入框间距，默认为8px */
	gap?: number
	/** 圆角大小，默认为8px */
	borderRadius?: number
	/** 当前值 */
	value?: string
	/** 值变化回调 */
	onChange?: (value: string) => void
	/** 输入完成回调 */
	onComplete?: (value: string) => void
	/** 是否禁用 */
	disabled?: boolean
	/** 是否自动聚焦 */
	autoFocus?: boolean
	/** 输入框类型，默认为text */
	type?: 'text' | 'number' | 'password'
	/** 占位符 */
	placeholder?: string
	/** 自定义样式 */
	className?: string
	/** 错误状态 */
	error?: boolean
	/** 成功状态 */
	success?: boolean
}

const Container = styled.div<{
	$size: number
	$gap: number
	$length: number
}>`
  display: flex;
  gap: ${(props) => props.$gap}px;
  width: fit-content;
`

const InputWrapper = styled.div<{
	$size: number
	$borderRadius: number
	$error: boolean
	$success: boolean
	$disabled: boolean
}>`
  position: relative;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: ${(props) => props.$borderRadius}px;
  border: 2px solid ${(props) => {
		if (props.$error) return '#ff4d4f'
		if (props.$success) return '#52c41a'
		return '#d9d9d9'
	}};
  background: ${(props) => (props.$disabled ? '#f5f5f5' : '#fff')};
  transition: all 0.3s ease;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'text')};

  &:hover {
    border-color: ${(props) => {
			if (props.$error) return '#ff7875'
			if (props.$success) return '#73d13d'
			return '#40a9ff'
		}};
  }

  &:focus-within {
    border-color: ${(props) => {
			if (props.$error) return '#ff7875'
			if (props.$success) return '#73d13d'
			return '#1890ff'
		}};
    box-shadow: 0 0 0 2px ${(props) => {
			if (props.$error) return 'rgba(255, 77, 79, 0.2)'
			if (props.$success) return 'rgba(82, 196, 26, 0.2)'
			return 'rgba(24, 144, 255, 0.2)'
		}};
  }
`

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0;
`

const DisplayInput = styled.div<{
	$size: number
	$borderRadius: number
	$disabled: boolean
}>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => Math.max(16, props.$size * 0.4)}px;
  font-weight: 600;
  color: #262626;
  border-radius: ${(props) => props.$borderRadius}px;
  user-select: none;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  background: transparent;
`

const SquareInputBox: React.FC<SquareInputBoxProps> = ({
	length = 6,
	size = 48,
	gap = 8,
	borderRadius = 8,
	value = '',
	onChange,
	onComplete,
	disabled = false,
	autoFocus = false,
	type = 'text',
	placeholder = '',
	className,
	error = false,
	success = false,
}) => {
	const [inputValue, setInputValue] = useState(value)
	const [focusedIndex, setFocusedIndex] = useState(-1)
	const [lastCompletedLength, setLastCompletedLength] = useState(0)
	const hiddenInputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	// 同步外部value
	useEffect(() => {
		setInputValue(value)
		setLastCompletedLength(value.length)
	}, [value])

	// 自动聚焦
	useEffect(() => {
		if (autoFocus && !disabled) {
			setTimeout(() => {
				hiddenInputRef.current?.focus()
			}, 100)
		}
	}, [autoFocus, disabled])

	// 处理输入变化
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (disabled) return

			const input = e.target.value
			let newValue = input

			// 限制输入长度
			if (newValue.length > length) {
				newValue = newValue.slice(0, length)
			}

			// 根据类型过滤输入
			if (type === 'number') {
				newValue = newValue.replace(/[^0-9]/g, '')
			}

			setInputValue(newValue)
			onChange?.(newValue)

			// 检查是否输入完成
			if (newValue.length === length && lastCompletedLength < length) {
				setLastCompletedLength(length)
				onComplete?.(newValue)
			}

			// 自动聚焦到下一个输入框
			if (newValue.length < length && newValue.length > inputValue.length) {
				setFocusedIndex(newValue.length)
			}
		},
		[disabled, length, type, onChange, onComplete, inputValue, lastCompletedLength],
	)

	// 处理点击事件
	const handleClick = useCallback(
		(index: number) => {
			if (disabled) return

			setFocusedIndex(index)
			hiddenInputRef.current?.focus()
		},
		[disabled],
	)

	// 处理键盘事件
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (disabled) return

			if (e.key === 'Backspace') {
				if (inputValue.length > 0) {
					const newValue = inputValue.slice(0, -1)
					setInputValue(newValue)
					onChange?.(newValue)
					setFocusedIndex(Math.max(0, newValue.length - 1))
					setLastCompletedLength(newValue.length)
				}
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault()
				setFocusedIndex(Math.max(0, focusedIndex - 1))
			} else if (e.key === 'ArrowRight') {
				e.preventDefault()
				setFocusedIndex(Math.min(length - 1, focusedIndex + 1))
			}
		},
		[disabled, inputValue, onChange, focusedIndex, length],
	)

	// 处理聚焦事件
	const handleFocus = useCallback(() => {
		if (disabled) return
		setFocusedIndex(Math.min(inputValue.length, length - 1))
	}, [disabled, inputValue.length, length])

	// 处理失焦事件
	const handleBlur = useCallback(() => {
		setFocusedIndex(-1)
	}, [])

	// 渲染输入框
	const renderInputs = () => {
		const inputs = []
		for (let i = 0; i < length; i++) {
			const char = inputValue[i] || ''
			const isFocused = i === focusedIndex

			inputs.push(
				<InputWrapper
					key={i}
					$size={size}
					$borderRadius={borderRadius}
					$error={error}
					$success={success}
					$disabled={disabled}
					onClick={() => handleClick(i)}
					style={{
						borderColor: isFocused ? '#1890ff' : undefined,
						boxShadow: isFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : undefined,
					}}
				>
					<DisplayInput $size={size} $borderRadius={borderRadius} $disabled={disabled}>
						{type === 'password' ? (char ? '●' : '') : char}
					</DisplayInput>
				</InputWrapper>,
			)
		}
		return inputs
	}

	return (
		<Container ref={containerRef} $size={size} $gap={gap} $length={length} className={className}>
			{renderInputs()}
			<HiddenInput
				ref={hiddenInputRef}
				type={type}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder={placeholder}
				disabled={disabled}
				autoComplete='off'
				autoCorrect='off'
				autoCapitalize='off'
				spellCheck='false'
				inputMode={type === 'number' ? 'numeric' : 'text'}
			/>
		</Container>
	)
}

export default SquareInputBox
