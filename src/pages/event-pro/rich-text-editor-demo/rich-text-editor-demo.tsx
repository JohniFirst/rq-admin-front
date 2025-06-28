import { useState } from 'react'
import styled from 'styled-components'
import RichTextEditor from '@/components/rich-text-editor/rich-text-editor'

const DemoWrapper = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
`

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
`

const Output = styled.div`
  margin-top: 32px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  min-height: 80px;
  border: 1px solid #e5e7eb;
  word-break: break-all;
`

const OutputContent = styled.div`
  font-size: 1rem;
  color: #333;
  line-height: 1.7;
`

const RichTextEditorDemo = () => {
  const [value, setValue] = useState('')

  return (
    <DemoWrapper>
      <Title>富文本编辑器示例</Title>
      <RichTextEditor value={value} onChange={setValue} placeholder="请输入内容..." />
      <Output>
        {/* 仅做演示用途，实际项目请对 value 进行 XSS 过滤！ */}
        {value ? (
          <OutputContent>{value}</OutputContent>
        ) : (
          <span style={{ color: '#aaa' }}>暂无内容</span>
        )}
      </Output>
    </DemoWrapper>
  )
}

export default RichTextEditorDemo
