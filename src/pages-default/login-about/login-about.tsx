import { Outlet } from 'react-router-dom'

export default function LoginAbout() {
	return (
		<section className='w-screen h-screen overflow-hidden'>
			<video
				className='position-fixed top-0 left-0 w-screen h-screen object-cover z-[-1]'
				autoPlay
				loop
				muted
			>
				<source src='/demo.mp4' type='video/mp4' />
				您的浏览器不支持视频标签。请升级到最新版本的浏览器。
			</video>

			<section className='w-[450px] p-[24px] absolute top-1/2 left-[300px] translate-y-[-50%] bg-white bg-opacity-80 rounded-lg'>
				<Outlet />
			</section>
		</section>
	)
}
