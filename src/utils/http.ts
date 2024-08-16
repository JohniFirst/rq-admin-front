import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})

http.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  ({ data }: AxiosResponse) => {
    if (data.code === 200) {
      return data
    }

    throw new Error(data.message)
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export { http }
