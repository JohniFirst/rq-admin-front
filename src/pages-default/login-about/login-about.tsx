import { Outlet } from 'react-router-dom'
import { Novatrix } from 'uvcanvas'

export default function LoginAbout() {
	return (
		<section className='overflow-hidden p-6 flex items-center justify-center w-screen h-screen'>
			<div className='absolute top-0 left-0 right-0 bottom-0 w-screen h-screen z-[-2]'>
				<Novatrix />
			</div>

			<section className='w-full bg-white bg-opacity-80 rounded-lg p-6 sm:w-3/4 md:w-[500px]'>
				<Outlet />
			</section>
		</section>
	)
}
