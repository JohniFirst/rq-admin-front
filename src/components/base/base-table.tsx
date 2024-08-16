import { exportToExcel } from '@/utils/export-to-excel'
import {
  DownloadOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Space, Table, Tooltip } from 'antd'
import { format } from 'date-fns'
import type { FormProps, TableProps } from 'antd'

type BaseTableProps = {
  tableProps: TableProps
  searchProps?: FormProps
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

const BaseTable: React.FC<BaseTableProps> = ({ tableProps }) => {
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
        <Table
          {...tableProps}
          className="print-table"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总计 ${total} 条`,
            ...tableProps.pagination,
          }}
        />
      </section>
    </>
  )
}

export default BaseTable
