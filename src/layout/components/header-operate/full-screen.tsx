import { useFullScreen } from '@/hooks/useFullScreen'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'

function FullScreen() {
	const { isFullscreen, toggleFullscreen } = useFullScreen(true)

	return (
		<div
			className='cursor-pointer'
			onClick={toggleFullscreen}
			onKeyUp={() => toggleFullscreen}
		>
			{isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
		</div>
	)
}

export default FullScreen
