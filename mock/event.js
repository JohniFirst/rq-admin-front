import { responseFormat } from "./response-format"

export default [
  {
    url: '/api/uploaded-image-list',
    method: 'post',
    response: ({ query }) => {
      return responseFormat([
        {
          id: 1,
          name: '测试小姐姐1号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/ad83aed7-b681-4f11-b092-2e28d7e7ddfb_1726816098673010164_origin~tplv-a9rns2rl98-image.png?rk3s=b14c611d&x-expires=1758352098&x-signature=ZYmZ2V8Fhw1tbiBcuJh6dwsZ38g%3D',
          description: '这是测试小姐姐1号',
          created_at: '2024-09-20',
        },
        {
          id: 2,
          name: '测试小姐姐2号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/628c4e35-287a-4f85-b77a-1b8466080710_1726816167322978342_origin~tplv-a9rns2rl98-image.png?rk3s=b14c611d&x-expires=1758352167&x-signature=Kk1ec7p2eovF%2F4Ml%2BXMz0fS7jWE%3D',
          description: '这是测试小姐姐2号',
          created_at: '2024-09-18',
        },
        {
          id: 3,
          name: '测试小姐姐3号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/757e0bb3-18f3-4d7e-b764-a00631169384_1726817215673055973_origin~tplv-a9rns2rl98-web-thumb.jpeg?rk3s=b14c611d&x-expires=1758353215&x-signature=DXnwQZ3tkzLW%2FnemKCwJawu6jaI%3D',
          description: '这是测试小姐姐3号',
          created_at: '2024-09-18',
        },
        {
          id: 4,
          name: '测试小姐姐4号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/df82ed68-2036-4758-92db-e1c87c56632b_1726817216031557754_origin~tplv-a9rns2rl98-image.png?rk3s=b14c611d&x-expires=1758353216&x-signature=hegJJBrxKT3bqHNlXCO%2BIlmzeKM%3D',
          description: '这是测试小姐姐4号',
          created_at: '2024-09-18',
        },
        {
          id: 5,
          name: '测试小姐姐5号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/14a1fc8e-ff13-49fb-a462-832192cb4117_1726817307210033613_origin~tplv-a9rns2rl98-image.png?rk3s=b14c611d&x-expires=1758353307&x-signature=uu9Hrei2Cvkbj6PIsj5wkWuDn1Q%3D',
          description: '这是测试小姐姐5号',
          created_at: '2024-09-18',
        },
        {
          id: 6,
          name: '测试小姐姐6号',
          src: 'https://p6-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/fdda81bc-a558-4530-b7a0-875bdd19fe8e_1726817307513231403_origin~tplv-a9rns2rl98-image.png?rk3s=b14c611d&x-expires=1758353307&x-signature=OT%2FcLhnx773fBFDVXAhylUs0ybo%3D',
          description: '这是测试小姐姐6号',
          created_at: '2024-09-18',
        },
      ])
    },
  },
]