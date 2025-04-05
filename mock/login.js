import { responseFormat } from "./response-format"

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ query }) => {
      return responseFormat({
        name: '123123123',
      })
    },
  },
]
