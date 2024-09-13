import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slice/system-info.ts'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Switch } from 'antd'
import type { FC } from 'react'

const ThemeSwitcher: FC = () => {
	const theme = useAppSelector((state) => state.systemInfo.theme)
	const dispatch = useAppDispatch()

	// 切换主题的函数
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		dispatch(setTheme(newTheme))
	}

	return (
		<Switch
			checkedChildren={<MoonOutlined />}
			unCheckedChildren={<SunOutlined />}
			checked={theme === 'dark'}
			onChange={toggleTheme}
		/>
	)
}

export default ThemeSwitcher
