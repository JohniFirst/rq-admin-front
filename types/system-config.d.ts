type PaginationResponse<T> = {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
}

type GlobalResponse<T> = {
  code: 200 | 500
  message: string
  data: T
}

type FullPaginationResponse<T> = GlobalResponse<PaginationResponse<T>>
