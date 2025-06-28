import { useState } from 'react'
import ReactQuill from 'react-quill'
import styled from 'styled-components'
import 'react-quill/dist/quill.snow.css'
import { uploadFile } from './upload-helper'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

const EditorWrapper = styled.div`
  width: 100%;
  .ql-toolbar.ql-snow {
    border-radius: 0.5rem 0.5rem 0 0;
    border-color: #e5e7eb;
    background-color: #f9fafb;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 0.5rem 0.5rem;
    border-color: #e5e7eb;
    min-height: 150px;
  }
`

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'],
]

const modules = {
  toolbar: {
    container: toolbarOptions,
    handlers: {
      image: function (this: {
        quill: {
          getSelection: () => { index: number }
          insertEmbed: (index: number, type: string, url: string) => void
        }
      }) {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const url = await uploadFile(input.files[0])
            const range = this.quill.getSelection()
            this.quill.insertEmbed(range.index, 'image', url)
          }
        }
      },
      video: function (this: {
        quill: {
          getSelection: () => { index: number }
          insertEmbed: (index: number, type: string, url: string) => void
        }
      }) {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'video/*')
        input.click()
        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const url = await uploadFile(input.files[0])
            const range = this.quill.getSelection()
            this.quill.insertEmbed(range.index, 'video', url)
          }
        }
      },
    },
  },
}

const formats = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'script',
  'header',
  'list',
  'indent',
  'direction',
  'align',
  'link',
  'image',
  'video',
]

const RichTextEditor = ({ value = '', onChange, placeholder }: RichTextEditorProps) => {
  const [content, setContent] = useState(value)

  const handleChange = (val: string) => {
    setContent(val)
    onChange?.(val)
  }

  return (
    <EditorWrapper>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleChange}
        placeholder={placeholder || '请输入内容...'}
        modules={modules}
        formats={formats}
        className="bg-white border border-gray-200 min-h-[200px]"
      />
    </EditorWrapper>
  )
}

export default RichTextEditor
