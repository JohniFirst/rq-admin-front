import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable, TableDropdown } from '@ant-design/pro-components'
import { Button, Space, Tag } from 'antd'
import { useRef, useState } from 'react'

export type EnumsTypes = {
  id: number
  enumName: string
  enumKey: string
  created_at: string
  updated_at: string
  labels?: { name: string; color?: string }[]
}

// minimal declaration for the `request` helper used by pro-table examples
declare function request<T = unknown>(url: string, options?: unknown): Promise<T>

const columns: ProColumns<EnumsTypes>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tooltip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => (
      <Space>
        {(record.labels ?? []).map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: value => {
        return {
          startTime: value[0],
          endTime: value[1],
        }
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_text, record, _r, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        编辑
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
]

const EnumsKeys = ({ onSelect }: { onSelect?: (record: EnumsTypes) => void }) => {
  const actionRef = useRef<ActionType>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleRowSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: EnumsTypes[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    if (onSelect && selectedRows.length > 0) {
      onSelect(selectedRows[0])
    }
  }
  return (
    <ProTable<EnumsTypes>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: handleRowSelectChange,
      }}
      request={async (params, sort, filter) => {
        console.log(sort, filter)
        return request<{
          data: EnumsTypes[]
        }>('https://proapi.azurewebsites.net/github/issues', {
          params,
        })
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value)
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            }
          }
          return values
        },
      }}
      pagination={{
        pageSize: 10,
        onChange: page => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload()
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  )
}

export default EnumsKeys
