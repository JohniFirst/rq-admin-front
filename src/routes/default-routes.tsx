import type { RouteObject } from 'react-router-dom'

import LoginForm from '@/pages/login-about/login'
import Home from '@/pages/home/Home'
import NotFound from '@/pages/NotFound/NotFound'
import RegisterForm from '@/pages/login-about/register'

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
