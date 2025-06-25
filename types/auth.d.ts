type BaseLoginFormValues = {
	// 用户名
	username: string
	// 密码
	password: string
}

type LoginFormValues = BaseLoginFormValues & {
	// 验证码
	verificationCode?: string
	// 记住我
	remember?: boolean
}

type RegisterFormValues = BaseLoginFormValues & {
	// 电子邮箱
	email: string
	// 确认密码
	confirmPassword: string
	phone: string
	nickname: string
	// 头像
	avator: string
}

type ForgotPasswordFormValues = {
	// 电子邮箱
	email: string
}
