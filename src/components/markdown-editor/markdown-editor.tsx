import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import { Editor } from '@bytemd/react'
import { useMemo } from 'react'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown.css'
import styled from 'styled-components'
import { pluginAlign } from './plugins/plugin-align'
import { pluginImageResize } from './plugins/plugin-image-resize'
import { pluginInsertTime } from './plugins/plugin-insert-time'
import zhCN from 'bytemd/locales/zh_Hans.json'
import gfmZhCN from '@bytemd/plugin-gfm/locales/zh_Hans.json'

const MdeditorWp = styled.div<{ height?: string | number }>`
  height: ${props => props.height};

  .bytemd-body {
    height: calc(100vh - 230px);
  }
`

interface MarkdownEditorProps {
  value: string
  onChange: (v: string) => void
  height?: string | number
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, height = 800 }) => {
  const plugins = useMemo(
    () => [
      gfm({ locale: gfmZhCN }),
      highlight(),
      frontmatter(),
      math(),
      mermaid(),
      mediumZoom(),
      pluginInsertTime(), // 自定义插件
      pluginImageResize(), // 图片缩放插件
      pluginAlign(), // 文本对齐插件
    ],
    [],
  )

  return (
    <MdeditorWp height={height}>
      <Editor value={value} locale={zhCN} plugins={plugins} onChange={onChange} />
    </MdeditorWp>
  )
}

export default MarkdownEditor
