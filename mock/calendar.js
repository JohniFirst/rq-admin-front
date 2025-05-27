import fs from "fs";
import { responseFormat } from "./response-format"
import dayjs from "dayjs";
// import { fs } from 'fs'

export default [
  {
    url: '/event/add',
    method: 'post',
    response: ({ url, body, query }) => {
      fs.writeFile('./mock/data/calendar.json', JSON.stringify(body), (err) => {
        if (err) {
          console.error('写入文件失败', err);
        } else {
          console.log('写入文件成功', dayjs().format('YYYY-MM-DD HH:mm:ss'));
        }
      });

      return responseFormat({
        name: '123123123',
      })
    },
  },
  {
    url: '/event/list',
    method: 'post',
    response: ({ url, body, query }) => {
      const data = fs.readFileSync('./mock/data/calendar.json', 'utf-8');
      return responseFormat(JSON.parse(data))
    },
  },
]
