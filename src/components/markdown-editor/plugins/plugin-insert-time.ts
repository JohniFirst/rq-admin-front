import type { BytemdPlugin } from 'bytemd'

// 示例：自定义插件，插入当前时间
export function pluginInsertTime(): BytemdPlugin {
  return {
    actions: [
      {
        title: '插入当前时间',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 4V8L10.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        handler: {
          type: 'action',
          click({ editor }) {
            const now = new Date().toLocaleString()
            editor.replaceSelection(now)
          },
        },
      },
    ],
  }
}
