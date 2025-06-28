import { decryptData, encryptData } from './security'

const ENCRYPTION_KEY = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-key'

// 安全的本地存储
export const secureStorage = {
  // 设置加密数据
  set: <T = unknown>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value)
      const encryptedValue = encryptData(serializedValue, ENCRYPTION_KEY)
      localStorage.setItem(key, encryptedValue)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  // 获取解密数据
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return defaultValue

      const decryptedValue = decryptData(encryptedValue, ENCRYPTION_KEY)
      return JSON.parse(decryptedValue) as T
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  // 删除数据
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  // 清除所有数据
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

// 会话存储（不加密，因为会话存储是临时的）
export const sessionStorage = {
  set: <T = unknown>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value)
      window.sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error('Error saving to sessionStorage:', error)
    }
  },

  get: <T>(key: string, defaultValue: T): T => {
    try {
      const value = window.sessionStorage.getItem(key)
      if (!value) return defaultValue
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  },
}
