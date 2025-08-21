import type { ProColumns } from '@ant-design/pro-components'
import { EditableProTable } from '@ant-design/pro-components'
import React, { useEffect, useState } from 'react'
import { EnumsTypes } from './EnumsKeys'

type EnumItems = {
  id: React.Key
  dictKey: string
  dictLabel: string
  isEnable: '1' | '0'
  created_at?: number
  update_at?: number
}

const defaultData: EnumItems[] = [
  {
    id: 624748504,
    dictKey: '活动名称一',
    dictLabel: '活动名称一',
    isEnable: '1',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
  {
    id: 624748504,
    dictKey: '活动名称二',
    dictLabel: '活动名称二',
    isEnable: '0',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
]

const EnumsOptions = ({ selectedEnum }: { selectedEnum: EnumsTypes | null }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<readonly EnumItems[]>([])

  useEffect(() => {
    console.log(selectedEnum)
  }, [selectedEnum])

  const columns: ProColumns<EnumItems>[] = [
    {
      title: 'Value',
      key: 'dictKey',
      dataIndex: 'dictKey',
    },
    {
      title: 'dictLabel',
      dataIndex: 'dictLabel',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      valueType: 'switch',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter(item => item.id !== record.id))
          }}
        >
          删除
        </a>,
      ],
    },
  ]

  return (
    <EditableProTable<EnumItems>
      rowKey="id"
      maxLength={5}
      recordCreatorProps={{
        position: 'bottom',
        record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
      }}
      loading={false}
      columns={columns}
      request={async () => ({
        data: defaultData,
        total: 3,
        success: true,
      })}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row)
        },
        onChange: setEditableRowKeys,
      }}
    />
  )
}

export default EnumsOptions
