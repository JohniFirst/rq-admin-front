import { Outlet } from 'react-router-dom'
import { Novatrix } from 'uvcanvas'

export default function LoginAbout() {
	return (
		<section className='w-screen h-screen overflow-hidden'>
			<Novatrix />

			<section className='w-[450px] p-[24px] absolute top-1/2 left-[300px] translate-y-[-50%] bg-white bg-opacity-80 rounded-lg'>
				<Outlet />
			</section>
		</section>
	)
}
