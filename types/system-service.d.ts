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
