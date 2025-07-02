import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentTheme, setTheme } from '@/store/slice/system-info'

const ThemeSwitcher = () => {
  const currentTheme = useAppSelector(selectCurrentTheme)
  const dispatch = useAppDispatch()

  const isDark = currentTheme.isDark

  const toggleTheme = () => {
    // 找到下一个主题（在预设主题中循环）
    const presetThemes = [
      { id: 'default-light', isDark: false },
      { id: 'purple-dark', isDark: true },
      { id: 'green-light', isDark: false },
      { id: 'ocean-light', isDark: false },
    ]

    const currentIndex = presetThemes.findIndex(theme => theme.id === currentTheme.id)
    const nextIndex = (currentIndex + 1) % presetThemes.length
    const nextTheme = presetThemes[nextIndex]

    dispatch(setTheme(nextTheme.id))
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-start relative w-12 h-6 rounded-full p-1 transition-colors duration-500 ${
        isDark ? 'bg-primary' : 'bg-surface'
      }`}
      whileTap={{ scale: 0.95 }}
      aria-label="切换主题"
    >
      <motion.div
        className={`absolute w-5 h-5 rounded-full transition-all duration-500 ${
          isDark ? 'bg-background translate-x-6' : 'bg-background translate-x-0'
        }`}
        layout
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 ${
            isDark ? 'text-primary' : 'text-warning'
          }`}
          role="img"
          aria-label="切换主题"
          initial={false}
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{
            duration: 0.7,
            ease: 'easeInOut',
          }}
        >
          {isDark ? (
            <path
              fillRule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clipRule="evenodd"
            />
          ) : (
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          )}
        </motion.svg>
      </motion.div>
    </motion.button>
  )
}

export default ThemeSwitcher
