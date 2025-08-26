import { message } from 'antd'
import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { generateCSRFToken } from './security'
import { forage } from './localforage'
import { ForageEnums } from '@/enums/localforage'

// 创建 axios 实例
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 添加 CSRF Token
    const csrfToken = generateCSRFToken()
    const headers = new AxiosHeaders(config.headers)
    headers.set('X-CSRF-Token', csrfToken)

    // 从 localStorage 获取 token
    const token = await forage.getItem(ForageEnums.TOKEN)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    config.headers = headers
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code } = response.data

    if (code === 200) {
      return response.data.data
    } else {
      message.error(response.data.message)
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足')
          break
        case 404:
          // 资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误')
          break
        default:
          console.error('请求失败')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  },
)

export default http
