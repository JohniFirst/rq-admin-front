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
import { Tree } from 'antd'
import type { GetProps, TreeDataNode, TreeProps } from 'antd'

const MdeditorWp = styled.div<{ height?: string | number }>`
  height: ${props => props.height};
  display: grid;
  grid-template-columns: 300px 1fr;

  .bytemd-body {
    height: calc(100vh - 230px);
  }
`

interface MarkdownEditorProps {
  value: string
  onChange: (v: string) => void
  height?: string | number
}

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>

const { DirectoryTree } = Tree

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

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info)
  }

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('文件夹展开的回调，意味着可以在这个做懒加载', keys, info)
  }

  const treeData: TreeDataNode[] = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
        { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
        {
          title: 'leaf 0-2',
          key: '0-0-2',
          children: [
            { title: 'leaf 0-2-0', key: '0-0-2-0', isLeaf: true },
            { title: 'leaf 0-2-1', key: '0-0-2-1', isLeaf: true },
          ],
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
        { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
      ],
    },
  ]

  const onDrop: TreeProps['onDrop'] = info => {
    console.log(info)
  }

  return (
    <MdeditorWp height={height}>
      <DirectoryTree
        multiple
        draggable={{ icon: false }}
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        onDrop={onDrop}
        treeData={treeData}
      />

      <Editor value={value} locale={zhCN} plugins={plugins} onChange={onChange} />
    </MdeditorWp>
  )
}

export default MarkdownEditor
