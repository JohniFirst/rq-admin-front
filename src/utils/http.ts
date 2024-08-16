import { message } from 'antd'
import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

http.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  ({ data }: AxiosResponse) => {
    if (data.code === 200) {
      if (data.data) {
        return data.data
      }

      return data
    }

    // antd 抛出错误
    message.error(data.message)

    throw new Error(data.message)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)

export { http }
