import share from '@/assets/imgs/share.jpg'
import useCustomNavigate from '@/hooks/useCustomNavigate'

const showList = [
	{
		id: 1,
		src: share,
		title: '给你一个炫彩的标题',
		descriptions: 'lorem ',
		time: '2024-08-14',
	},
]

/** 共享元素动画列表 */
function ShareAnimation() {
	const navigate = useCustomNavigate()

	return (
		<ul className='custom-container'>
			{showList.map((item) => (
				<li
					className='flex mb-4 border-b-2 py-3'
					onClick={() => navigate('/event-pro/animate/share-animation/share-animation-detail', false)}
					onKeyUp={() => navigate('/event-pro/animate/share-animation/share-animation-detail', false)}
					key={item.id}
				>
					<img className='mr-4 share-animation' src={item.src} alt={item.title} width={300} />
					<div>
						<p className='text-lg'>{item.title}</p>
						<p>{item.descriptions}</p>
						<p>{item.time}</p>
					</div>
				</li>
			))}
		</ul>
	)
}

export default ShareAnimation
