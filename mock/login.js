import { responseFormat } from './response-format'

export default [
	{
		url: '/login',
		method: 'post',
		response: ({ query }) => {
			return responseFormat({
				name: '123123123',
			})
		},
	},
]
