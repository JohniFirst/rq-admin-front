import { Button } from 'antd'
import type React from 'react'
import styled from 'styled-components'
import ContextMenu, { type ContextMenuItem } from '@/components/context-menu/context-menu'

const InnerDiv = styled.div`
  width: 300px;
  height: 120px;
  border: 1px dashed #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: context-menu;
`

const menu: ContextMenuItem[] = [
  { label: '编辑', onClick: () => alert('编辑') },
  { label: '删除', onClick: () => alert('删除') },
  { label: '禁用项', onClick: () => {}, disabled: true },
]

const ContextMenuDemo: React.FC = () => {
  return (
    <div className="p-[40px]">
      <h2>右键菜单组件示例</h2>
      <ContextMenu menu={menu}>
        <InnerDiv>右键点击这里试试</InnerDiv>
      </ContextMenu>

      <div className="mt-[32px]">
        <ContextMenu menu={menu}>
          <Button type="primary">右键点击这个按钮</Button>
        </ContextMenu>
      </div>
    </div>
  )
}

export default ContextMenuDemo
