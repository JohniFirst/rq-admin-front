import { batchDeleteFile, getFileList } from '@/api/event-pro/file'
import { EnabledStatusEnum } from '@/enums/system'
import { Button, message, Modal, Table, TableProps } from 'antd'
import { useEffect, useState } from 'react'

export type FileListParams = {
  pageNumber?: number
  pageSize?: number
}

export type FileListRes = {
  id: string
  originalFilename: string
  filename: string
  filePath: string
  fileSize: number
  fileType: string
  uploadTime: string
  uploadUserId: string | null
  description: string | null
  isEnabled: EnabledStatusEnum
}

const FileManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<FileListRes[]>([])

  useEffect(() => {
    getDataList()
  }, [])

  const getDataList = async () => {
    const res = await getFileList({
      pageNumber: 1,
      pageSize: 10,
    })

    setDataSource(res.data)
  }

  const handleDelete = (id: string) => {
    console.log(id)
    Modal.confirm({
      title: '确定删除该文件吗？',
      onOk: async () => {
        await batchDeleteFile([id])

        message.success('删除成功')
        getDataList()
      },
    })
  }

  const columns: TableProps<FileListRes>['columns'] = [
    {
      title: '文件名',
      dataIndex: 'originalFilename',
      render: (_, { originalFilename, id, isEnabled }) => {
        if (isEnabled === EnabledStatusEnum.DISABLED) {
          return originalFilename
        }

        return (
          <a
            href={import.meta.env.VITE_API_BASE_URL + '/file/download/' + id}
            download={originalFilename}
            target="_blank"
            rel="noreferrer"
          >
            {originalFilename}
          </a>
        )
      },
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      render: (_, { isEnabled }) => {
        return isEnabled === EnabledStatusEnum.ENABLED ? '启用' : '禁用'
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, { id }) => {
        return (
          <Button type="link" onClick={() => handleDelete(id)}>
            删除
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <ul>
        <li>所有文件</li>
      </ul>

      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </>
  )
}

export default FileManagement
