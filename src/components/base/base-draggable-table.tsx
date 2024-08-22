import { useEffect, useState } from 'react'
import { exportToExcel } from '@/utils/export-to-excel'
import {
  DownloadOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tooltip,
} from 'antd'
import { format } from 'date-fns'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { FormProps, TableProps } from 'antd'
import type { DragEndEvent } from '@dnd-kit/core'
import { sortMenu } from '@/store/slice/menu-slice'

type BaseTableProps = {
  tableProps: TableProps & {
    getList: () => void
  }
  searchProps?: FormProps
  addForm?: {
    addFormApi: unknown
    AddForm: React.FC
  }
}

type FieldType = {
  username?: string
  password?: string
  remember?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const BaseDraggableTable: React.FC<BaseTableProps> = ({
  tableProps,
  addForm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const res = await tableProps.getList()

    sortMenu(res)

    setDataSource(res)
  }

  const handleSubmit = async (values: { roleName: string }) => {
    await addForm?.addFormApi(values)

    getList()

    setIsModalOpen(false)
  }

  /**
   * Handles exporting data to an Excel file.
   *
   * @return {void} No return value, exports data to a file instead.
   */
  const handleExport = () => {
    // @ts-ignore
    const keys = tableProps.columns!.map((column) => column.dataIndex)
    const excelData: ExcelData = {
      headers: tableProps.columns!.map((column) => column.title) as string[],
      data: tableProps.dataSource!.map((item) => {
        return keys.map((key) => item[key])
      }),
    }
    exportToExcel(excelData, `${format(Date.now(), 'yyyy-MM-dd')}.xlsx`)
  }

  const CustomRow = (props: RowProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props['data-row-key'],
    })

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: 'move',
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    }

    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id)
        const overIndex = prev.findIndex((i) => i.key === over?.id)
        return arrayMove(prev, activeIndex, overIndex)
      })
    }
  }

  return (
    <>
      <Form
        className="container mb-4 w-full"
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button htmlType="submit">重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <section className="container">
        {/* 操作栏 */}
        <section className="mb-4 text-right">
          <Space size={'middle'}>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              新增
            </Button>

            <Tooltip title="导出Excel">
              <DownloadOutlined
                className="cursor-pointer hover:text-red-500"
                onClick={handleExport}
              />
            </Tooltip>

            <Tooltip title="打印">
              <PrinterOutlined
                className="cursor-pointer hover:text-red-500"
                onClick={() => window.print()}
              />
            </Tooltip>

            <Tooltip title="刷新">
              <ReloadOutlined className="cursor-pointer hover:text-red-500" />
            </Tooltip>

            <Tooltip title="列设置">
              <SettingOutlined className="cursor-pointer hover:text-red-500" />
            </Tooltip>
          </Space>
        </section>

        {/* 表格 */}
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className="print-table"
              rowKey="key"
              components={{
                body: { row: CustomRow },
              }}
              dataSource={dataSource}
              {...tableProps}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `总计 ${total} 条`,
                ...tableProps.pagination,
              }}
            />
          </SortableContext>
        </DndContext>
      </section>

      <Modal
        title="新增"
        open={isModalOpen}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setIsModalOpen(false)}
        cancelText="取消"
        okText="提交"
        modalRender={(dom) => <Form onFinish={handleSubmit}>{dom}</Form>}
      >
        {addForm ? <addForm.AddForm /> : null}
      </Modal>
    </>
  )
}

export default BaseDraggableTable
