import { useEffect, useState } from 'react'

interface UseMousePosition {
	x: number
	y: number
}

/**
 * Returns the current mouse position as an object with `x` and `y` properties.
 *
 * @return {Object} An object with `x` and `y` properties representing the current mouse position.
 */
const useMouse = (): UseMousePosition => {
	const [position, setPosition] = useState<UseMousePosition>({ x: 0, y: 0 })

	const updateMousePosition = (ev: MouseEvent) => {
		setPosition({ x: ev.clientX, y: ev.clientY })
	}

	useEffect(() => {
		window.addEventListener('mousemove', updateMousePosition)

		return () => {
			window.removeEventListener('mousemove', updateMousePosition)
		}
	}, [])

	return position
}

export default useMouse
