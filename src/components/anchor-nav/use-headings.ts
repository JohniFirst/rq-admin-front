import { useState, useEffect } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export function useHeadings(containerSelector?: string) {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    const extractHeadings = () => {
      const container = containerSelector
        ? document.querySelector(containerSelector)
        : document.body

      if (!container) return

      const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const extractedHeadings: Heading[] = []

      headingElements.forEach(element => {
        const id = element.id || generateId(element.textContent || '')
        const text = element.textContent?.trim() || ''
        const level = parseInt(element.tagName.charAt(1))

        // 如果没有id，为元素添加id
        if (!element.id) {
          element.id = id
        }

        extractedHeadings.push({ id, text, level })
      })

      setHeadings(extractedHeadings)
    }

    // 初始提取
    extractHeadings()

    // 监听DOM变化，重新提取标题
    const observer = new MutationObserver(extractHeadings)
    const container = containerSelector ? document.querySelector(containerSelector) : document.body

    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [containerSelector])

  return headings
}

// 生成唯一ID的辅助函数
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
