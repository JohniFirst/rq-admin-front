import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { useCustomRoutes } from './routes'
import { createBrowserRouter } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useJumpToVscodeSource } from '@/hooks/useJumpToVscodeSource'
import { useEffect } from 'react'
import {
  fetchInitialData,
  initSystemInfoState,
} from './store/slice/system-info'

function App() {
  const localTheme = useAppSelector((state) => state.systemInfo.theme)
  const { routes } = useCustomRoutes()
  const dispatch = useAppDispatch()

  const router = createBrowserRouter(routes)

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
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
