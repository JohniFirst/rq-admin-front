import type { ProColumns } from '@ant-design/pro-components'
import { EditableProTable } from '@ant-design/pro-components'
import React, { useState } from 'react'

type DataSourceType = {
  id: React.Key
  title?: string
  readonly?: string
  decs?: string
  state?: string
  created_at?: number
  update_at?: number
  children?: DataSourceType[]
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    readonly: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
  {
    id: 624691229,
    title: '活动名称二',
    readonly: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
    update_at: 1590481162000,
  },
]

const EnumsOptions = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([])

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Value',
      key: 'state',
      dataIndex: 'state',
      width: 150,
    },
    {
      title: 'Label',
      dataIndex: 'decs',
      width: 150,
    },
    {
      title: '是否启用',
      dataIndex: 'created_at',
      valueType: 'switch',
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
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
    <EditableProTable<DataSourceType>
      rowKey="id"
      maxLength={5}
      scroll={{
        x: 960,
      }}
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
