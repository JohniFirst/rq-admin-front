import { http } from '@/utils/http'

/** 注册 */
export function handleRegister(data: RegisterFormValues): Promise<null> {
  return http.post('/register', data)
}

/** 登录 */
export function handleLogin(data: LoginFormValues): Promise<null> {
  return http.post('/login', data)
}
