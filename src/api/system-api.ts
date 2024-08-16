import { http } from '@/utils/http'

/** 注册 */
export function handleRegister(data: RegisterFormValues): Promise<null> {
  return http.post('/register', data)
}

/** 登录 */
export function handleLogin(data: LoginFormValues): Promise<null> {
  return http.post('/login', data)
}

/** 所有用户列表 */
export function getAllUserList(): Promise<UserListRes[]> {
  return http.post('/user/list', {})
}

/** 用户启用/禁用 */
export function updateUserIsEnabled(data: {
  id: number
  isEnabled: 0 | 1
}): Promise<UserListRes[]> {
  return http.put('/user/update', data)
}
