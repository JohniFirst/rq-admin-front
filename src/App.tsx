import { ConfigProvider } from 'antd'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useJumpToVscodeSource } from '@/hooks/useJumpToVscodeSource'
import ThemeProvider from './layout/components/theme-provider'
import { defaultRoutes } from './routes/routes'
import { useAppDispatch } from './store/hooks'
import { fetchInitialData, initSystemInfoState } from './store/slice/system-info'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

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
			<ConfigProvider locale={locale}>
				<AnimatePresence mode='wait' initial={false}>
					<RouterProvider router={AppRouter} />
				</AnimatePresence>
			</ConfigProvider>
		</ThemeProvider>
	)
}

export default App
