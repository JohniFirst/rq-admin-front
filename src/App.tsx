import { useJumpToVscodeSource } from '@/hooks/useJumpToVscodeSource'
import { ConfigProvider, theme } from 'antd'
import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
	fetchInitialData,
	initSystemInfoState,
} from './store/slice/system-info'

import NotFound from '@/pages-default/NotFound/NotFound'
import Home from '@/pages-default/home/Home'
import type { JSX } from 'react/jsx-runtime'
import { generateRoutes } from './routes/dynamic-routes'

const lazyElement = (Element: React.LazyExoticComponent<() => JSX.Element>) => (
	<Suspense fallback={<p>loading</p>}>
		<Element />
	</Suspense>
)

function App() {
	const localTheme = useAppSelector((state) => state.systemInfo.theme)
	const dispatch = useAppDispatch()

	const defaultRoutes: RouteObject[] = [
		{ path: '/', element: <Home /> },
		{
			path: '/login',
			element: lazyElement(
				lazy(() => import('@/pages-default/login-about/login.tsx')),
			),
		},
		{
			path: '/register',
			element: lazyElement(
				lazy(() => import('@/pages-default/login-about/register.tsx')),
			),
		},
		{
			path: '/',
			element: lazyElement(lazy(() => import('@/layout/Layout.tsx'))),
			children: generateRoutes(),
		},
		{ path: '/*', element: <NotFound /> },
	]

	const router = createBrowserRouter(defaultRoutes)

	if (import.meta.env.MODE === 'development') {
		useJumpToVscodeSource()
	}

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
				<RouterProvider router={router} />
			</AnimatePresence>
		</ConfigProvider>
	)
}

export default App
