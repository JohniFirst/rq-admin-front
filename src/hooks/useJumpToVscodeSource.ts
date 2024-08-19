// @ts-nocheck
import { MouseEvent, useEffect } from 'react'

/**
 * A hook that allows jumping to the source code in VSCode by clicking on an element with the Ctrl key pressed.
 */
export function useJumpToVscodeSource() {
  const handleClick = (event: MouseEvent) => {
    if (event.ctrlKey && event.button === 0) {
      event.preventDefault()
      const element = event.target
      let sourceTarget

      if ('_reactRootContainer' in element) {
        sourceTarget = element._reactRootContainer._internalRoot.current.child
      }

      for (const key in element) {
        if (key.startsWith('__reactInternalInstance$')) {
          sourceTarget = element[key]
        }

        if (key.startsWith('__reactFiber')) {
          sourceTarget = element[key]
        }
      }

      const getDebugSouece = (target, depth = 1) => {
        // 避免太深层次的递归，影响性能
        if (depth > 10) {
          return
        }

        return (
          target._debugSource ?? getDebugSouece(target._debugOwner, depth + 1)
        )
      }

      const { _debugOwner } = sourceTarget
      const source = _debugOwner && getDebugSouece(_debugOwner)

      if (!source) {
        return
      }
      const { fileName, lineNumber = 1, columnNumber = 1 } = source

      const div = document.createElement('div')
      div.classList.add('jump-to-vscode-source-container')
      const linkA = document.createElement('a')
      linkA.href = `vscode://file/${fileName}:${lineNumber}:${columnNumber}`
      linkA.textContent = '跳转VSCode源码'
      div.appendChild(linkA)
      document.body.appendChild(div)
      // 获取视口的宽度和高度
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight

      const { width, height } = div.getBoundingClientRect()
      const { clientX, clientY } = event

      const left = clientX + width > viewportWidth ? clientX - width : clientX
      const top = clientY + height > viewportHeight ? clientY - height : clientY

      div.style.left = left + 'px'
      div.style.top = top + 'px'
      div.style.visibility = 'visible'

      const removeDiv = (event) => {
        if (event.target !== div && event.target !== linkA) {
          document.removeEventListener('click', removeDiv)
          if (document.body.contains(div)) {
            document.body.removeChild(div)
          }
        }
      }

      // 为 a 标签添加点击事件处理
      linkA.addEventListener('click', (event) => {
        event.stopPropagation() // 阻止事件冒泡
        document.body.removeChild(div)
      })

      // 为文档添加点击事件处理
      document.addEventListener('click', removeDiv)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])
}
