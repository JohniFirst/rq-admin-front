import { responseFormat } from "./response-format"

export default [
  {
    url: '/api/menu/list',
    method: 'get',
    response: ({ query }) => {
      return responseFormat([
        {
          menuOrder: 1,
          title: '首页',
          id: 1,
          url: "/dashboard",
          icon: 'test'
        },
        {
          menuOrder: 2,
          title: '业务组件',
          id: 3,
          url: "/event",
          icon: 'test',
          children: [
            {
              menuOrder: 1,
              title: '剪切板',
              id: 4,
              url: '/event/clipboard/copy-to-clipboard',
              icon: 'test'
            },
            {
              menuOrder: 2,
              title: '云相册',
              id: 5,
              url: '/event/cloud-album',
              icon: 'test'
            },
          ]
        }
      ])
    },
  },
]
