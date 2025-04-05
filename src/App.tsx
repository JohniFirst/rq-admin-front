import { useJumpToVscodeSource } from '@/hooks/useJumpToVscodeSource'
import { ConfigProvider, theme } from 'antd'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { defaultRoutes } from './routes/routes'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
	fetchInitialData,
	initSystemInfoState,
	setTheme,
} from './store/slice/system-info'

function App() {
	const localTheme = useAppSelector((state) => state.systemInfo.theme)
	const dispatch = useAppDispatch()

	const AppRouter = createBrowserRouter(defaultRoutes)

	if (import.meta.env.MODE === 'development') {
		useJumpToVscodeSource()
	}

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = (event: { matches: boolean }) => {
			dispatch(setTheme(event.matches ? 'dark' : 'light'))
		}
		mediaQuery.addEventListener('change', handleChange)
		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	useEffect(() => {
		name()
	}, [])

	async function name() {
		const payload = await fetchInitialData()

		dispatch(initSystemInfoState(payload))
	}

	return (
		<ConfigProvider
			theme={{
				algorithm:
					localTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorPrimary: '#FF4500',
				},
			}}
		>
			<AnimatePresence mode='wait' initial={false}>
				<RouterProvider router={AppRouter} />
			</AnimatePresence>
		</ConfigProvider>
	)
}

export default App
