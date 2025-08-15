import type { GetUserListParams, UserList } from '@/pages/system/user/User'
import { http } from '@/utils/http'

/** 注册 */
export function handleRegister(data: RegisterFormValues): Promise<null> {
  return http.post('/auth/register', data)
}

/** 登录 */
export function handleLogin(data: LoginFormValues): Promise<string> {
  return http.post('/auth/login', data)
}

/** 忘记密码 */
export function handleForgotPassword(data: ForgotPasswordFormValues): Promise<null> {
  return http.post('/forgot-password', data)
}

/** 所有用户列表 */
export function getAllUserList(data: GetUserListParams): Promise<DefaultPagination<UserList>> {
  return http.post('/user/list', data)
}

/** 用户启用/禁用 */
export function updateUserIsEnabled(data: {
  id: number
  isEnabled: 0 | 1
}): Promise<UserListRes[]> {
  return http.put('/user/update', data)
}

/** 所有角色列表 */
export function getAllRoleList(params: unknown): Promise<RoleListRes[]> {
  return http.get('/role/list', { params })
}

/** 角色枚举 */
export function getRoleEnumList(): Promise<SelectOptions[]> {
  return http.get('/role-enum-list')
}

/** 新增角色 */
export function addRole(data: { roleName: string }): Promise<null> {
  return http.post('/role/add', data)
}

/** 获取菜单列表 */
export function getMenuList(): Promise<MenuApiResponse[]> {
  return http.get('/menu/list')
}

/** 菜单列表不带角色信息 */
export function getMenuListWithoutRole(): Promise<MenuApiWithoutRoleResponse[]> {
  return http.get('/menu/without-role')
}

/** 新增菜单 */
export function addMenu(data: MenuAddFormFields): Promise<null> {
  return http.post('/menu-add', data)
}

/** 编辑菜单 */
export function editMenu(data: MenuAddFormFields) {
  return http.put('/menu-update', data)
}

/** 删除菜单 */
export function delMenu(id: number) {
  return http.delete('/menu/' + id)
}
