import { EditOutlined } from '@ant-design/icons'
import { Input, type InputProps, type InputRef } from 'antd'
import React, { type RefAttributes, useEffect, useRef } from 'react'

type DoubleClickEditProps = {
  inputProps?: InputProps & RefAttributes<InputRef>
  value: string
  editFinished: (newValue: string) => void
}

/**
 * 双击编辑组件
 * @prop inputProps 输入框的属性，完全使用antd的Input组件，可以直接传入antd官网的属性
 * @prop value 需要编辑的文字
 * @prop editFinished 编辑结束的回调函数，参数为编辑后的文字
 */
const DoubleClickEdit: React.FC<DoubleClickEditProps> = ({ inputProps, value, editFinished }) => {
  const inputRef = useRef<InputRef>(null)
  const [isEditing, setIsEditing] = React.useState(false)

  useEffect(() => {
    if (!isEditing) return

    inputRef.current!.focus({
      cursor: 'all',
    })
  }, [isEditing])

  function handleDoubleEdit() {
    setIsEditing(true)
  }

  function saveEdit(e: React.FocusEvent<HTMLInputElement>) {
    setIsEditing(false)
    editFinished(e.target.value)
  }

  const enterSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement

    setIsEditing(false)
    editFinished(target.value)
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        defaultValue={value}
        onBlur={saveEdit}
        onPressEnter={enterSave}
        {...inputProps}
      />
    )
  }

  return (
    <p onDoubleClick={handleDoubleEdit}>
      {value}
      <EditOutlined />
    </p>
  )
}

export default DoubleClickEdit
