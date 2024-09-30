import share from '@/assets/imgs/share.jpg'
import useCustomNavigate from '@/hooks/useCustomNavigate'

/** 共享元素动画详情 */
function ShareAnimationDetail() {
	const navigate = useCustomNavigate()

	const goBack = () => {
		navigate('/event-pro/animate/share-animation')
	}

	return (
		<div>
			<img
				className='share-animation'
				src={share}
				style={{ height: '500px' }}
				alt='测试图片'
				onClick={goBack}
				onKeyUp={goBack}
			/>
		</div>
	)
}

export default ShareAnimationDetail
