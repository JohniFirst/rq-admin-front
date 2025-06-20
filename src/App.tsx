import { useJumpToVscodeSource } from '@/hooks/useJumpToVscodeSource'
import { ConfigProvider } from 'antd'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ThemeProvider from './layout/components/theme-provider'
import { defaultRoutes } from './routes/routes'
import { useAppDispatch } from './store/hooks'
import { fetchInitialData, initSystemInfoState } from './store/slice/system-info'

function App() {
	const dispatch = useAppDispatch()
	const AppRouter = createBrowserRouter(defaultRoutes, {
		basename: '/rq-admin-front',
	})

	if (['test', 'development', 'mock'].includes(import.meta.env.MODE)) {
		useJumpToVscodeSource()
	}

	useEffect(() => {
		initApp()
	}, [])

	async function initApp() {
		const payload = await fetchInitialData()
		dispatch(initSystemInfoState(payload))
	}

	return (
		<ThemeProvider>
			<ConfigProvider>
				<AnimatePresence mode='wait' initial={false}>
					<RouterProvider router={AppRouter} />
				</AnimatePresence>
			</ConfigProvider>
		</ThemeProvider>
	)
}

export default App
