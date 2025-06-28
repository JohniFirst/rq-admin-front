import type { BytemdPlugin } from 'bytemd'

// 工具函数：将宽高写入 markdown 图片语法
function updateImageSizeInMarkdown(img: HTMLImageElement, width: number, height: number) {
  const src = img.getAttribute('src')
  if (!src) return
  const textarea = document.querySelector('.bytemd-textarea') as HTMLTextAreaElement
  if (!textarea) return
  // 匹配所有 ![alt](src) 或 ![alt](src =WxH)
  const regex = new RegExp(
    `(!\\[[^\\]]*\\]\\()${src.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(?:\\s*=\\d*x\\d*)?(\\))`,
    'g',
  )
  const newMd = `$1${src} =${width}x${height}$2`
  textarea.value = textarea.value.replace(regex, newMd)
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
}

export function pluginImageResize(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      // 只允许图片在预览区调整大小
      markdownBody.addEventListener('mousedown', e => {
        const target = e.target as HTMLElement
        if (target.tagName === 'IMG') {
          const img = target as HTMLImageElement
          // 只允许一个手柄
          let handle = img.parentElement?.querySelector('.img-resize-handle') as HTMLDivElement
          if (!handle) {
            handle = document.createElement('div')
            handle.className = 'img-resize-handle'
            Object.assign(handle.style, {
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '16px',
              height: '16px',
              background: 'rgba(0,0,0,0.2)',
              cursor: 'nwse-resize',
              borderRadius: '4px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })
            // 让图片父元素相对定位
            const parent = img.parentElement
            if (parent) {
              parent.style.position = 'relative'
              parent.appendChild(handle)
            }
          }
          // 手柄绝对定位于图片右下角
          handle.style.display = 'flex'
          handle.style.right = '0'
          handle.style.bottom = '0'
          handle.style.position = 'absolute'

          let startX = 0
          let startY = 0
          let startWidth = 0
          let startHeight = 0

          const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX
            const dy = moveEvent.clientY - startY
            const newWidth = Math.max(32, startWidth + dx)
            const newHeight = Math.max(32, startHeight + dy)
            img.width = newWidth
            img.height = newHeight
          }

          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            // 拖动结束后写入 markdown
            updateImageSizeInMarkdown(img, img.width, img.height)
          }

          handle.onmousedown = event => {
            event.stopPropagation()
            startX = event.clientX
            startY = event.clientY
            startWidth = img.width
            startHeight = img.height
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
          }
        }
      })
    },
  }
}
