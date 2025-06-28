import { lazy, Suspense } from 'react'
import type { JSX } from 'react/jsx-runtime'
import type { RouteObject } from 'react-router-dom'
import Loading from '@/components/loading'
import Home from '@/pages-default/home/Home'
import LoginForm from '@/pages-default/login-about/login'
import LoginAbout from '@/pages-default/login-about/login-about-wp'
import RegisterForm from '@/pages-default/login-about/register.tsx'
import NotFound from '@/pages-default/NotFound/NotFound'
import { generateRoutes } from './dynamic-routes'

const lazyElement = (Element: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<Loading />}>
    <Element />
  </Suspense>
)

export const defaultRoutes: RouteObject[] = [
  { path: '/', element: <Home /> },
  {
    path: '/login',
    element: <LoginAbout />,
    children: [
      { path: '', element: <LoginForm /> },
      { path: 'new', element: <RegisterForm /> },
      {
        path: 'forgot-password',
        element: lazyElement(lazy(() => import('@/pages-default/login-about/forgot-password.tsx'))),
      },
    ],
  },
  {
    path: '/',
    element: lazyElement(lazy(() => import('@/layout/Layout.tsx'))),
    children: generateRoutes(),
  },
  { path: '/*', element: <NotFound /> },
]
