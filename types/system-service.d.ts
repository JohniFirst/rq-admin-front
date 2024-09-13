interface LoginFormValues {
	username: string
	password: string
}

interface RegisterFormValues extends LoginFormValues {
	// email: string
}

type GlobalResponse<T> = {
	code: 200 | 500
	message: string
	data: T
}

type UserListRes = {
	id: number
	isEnabled: 0 | 1
}

type SelectOptions = {
	label: string
	value: string | number
}

type RoleListRes = {
	id: number
	roleName: string
}

type MenuApiWithoutRoleResponse = {
	menuOrder: number
	title: string
	id: number
	url: string
	icon: string
	children?: MenuApiResponse[]
}

type MenuApiResponse = MenuApiWithoutRoleResponse & {
	role: RoleListRes[]
}

type MenuAddFormFields = {
	title: string
	roles: string[]
	url: string
	icon: string
	parent: number
	menuOrder: number
}
