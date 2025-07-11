type ThemeColors = {
  primary: string
  secondary: string
  success: string
  warning: string
  danger: string
  info: string
  background: string
  surface: string
  text: string
  border: string
}

type ThemeConfig = {
  id: string
  name: string
  colors: ThemeColors
  isDark: boolean
}

type CustomTheme = ThemeConfig & {
  isCustom: boolean
  createdAt: number
  updatedAt: number
}
