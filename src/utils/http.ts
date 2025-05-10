import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig,
	type AxiosResponse,
	AxiosHeaders,
} from 'axios'
import { generateCSRFToken } from './security'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
})

// 请求拦截器
http.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 添加 CSRF Token
		const csrfToken = generateCSRFToken()
		const headers = new AxiosHeaders(config.headers)
		headers.set('X-CSRF-Token', csrfToken)

		// 从 localStorage 获取 token
		const token = localStorage.getItem('token')
		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}

		config.headers = headers
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

// 响应拦截器
http.interceptors.response.use(
	(response: AxiosResponse) => {
		return response.data
	},
	(error) => {
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

// 封装 GET 请求
export const get = <T>(url: string, params?: any): Promise<T> => {
	return http.get(url, { params })
}

// 封装 POST 请求
export const post = <T>(url: string, data?: any): Promise<T> => {
	return http.post(url, data)
}

// 封装 PUT 请求
export const put = <T>(url: string, data?: any): Promise<T> => {
	return http.put(url, data)
}

// 封装 DELETE 请求
export const del = <T>(url: string): Promise<T> => {
	return http.delete(url)
}

export default http
