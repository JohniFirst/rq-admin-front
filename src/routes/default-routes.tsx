import type { RouteObject } from 'react-router-dom'

import NotFound from '@/pages-default/NotFound/NotFound'
import Home from '@/pages-default/home/Home'
import LoginForm from '@/pages-default/login-about/login'
import RegisterForm from '@/pages-default/login-about/register'

// 默认路由
export const defaultRoutes: RouteObject[] = [
	{ path: '/', element: <Home /> },
	{ path: '/login', element: <LoginForm /> },
	{ path: '/register', element: <RegisterForm /> },
]

// 默认出错路由
export const errorRoutes: RouteObject[] = [
	{ path: '/*', element: <NotFound /> },
]
