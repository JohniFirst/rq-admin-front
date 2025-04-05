import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const FullScreen = () => {
	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement)
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)
		return () =>
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
	}, [])

	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen()
			} else {
				await document.exitFullscreen()
			}
		} catch (err) {
			console.error('Error attempting to toggle fullscreen:', err)
		}
	}

	return (
		<motion.div
			className='cursor-pointer'
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			onClick={toggleFullscreen}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 0.2,
					ease: 'easeOut',
				}}
			>
				{isFullscreen ? (
					<FullscreenExitOutlined className='text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300' />
				) : (
					<FullscreenOutlined className='text-xl text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300' />
				)}
			</motion.div>
		</motion.div>
	)
}

export default FullScreen
