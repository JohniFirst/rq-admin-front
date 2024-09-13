import { useFullScreen } from '@/hooks/useFullScreen'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'

function FullScreen() {
	const { isFullscreen, toggleFullscreen } = useFullScreen(true)

	return (
		<button onClick={toggleFullscreen}>
			{isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
		</button>
	)
}

export default FullScreen
