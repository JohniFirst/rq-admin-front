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

/** 所有角色列表 */
export function getAllRoleList(): Promise<RoleListRes[]> {
  return http.get('/role/list')
}

/** 角色枚举 */
export function getRoleEnumList(): Promise<SelectOptions[]> {
  return http.get('/role-enum-list')
}

/** 新增角色 */
export function addRole(data: { roleName: string }): Promise<null> {
  return http.post('/role/add', data)
}

/** 菜单列表 */
export function getMenuList(): Promise<string[]> {
  return http.get('/menu-list')
}

/** 菜单列表不带角色信息 */
export function getMenuListWithoutRole(): Promise<string[]> {
  return http.get('/menu/without-role')
}

/** 新增菜单 */
export function addMenu(data: { roleName: string }): Promise<null> {
  return http.post('/menu-add', data)
}

/** 删除菜单 */
export function delMenu(id: number) {
  return http.delete('/menu/' + id)
}
