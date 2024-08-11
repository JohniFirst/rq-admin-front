import {
  ColumnHeightOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, Table, Tooltip } from "antd";
import type { FormProps, TableProps } from "antd";
import * as XLSX from "xlsx";

interface ExcelData {
  headers: string[];
  data: unknown[][];
}

type BaseTableProps = {
  tableProps: TableProps;
  searchProps: FormProps;
};

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

/**
 * Handles exporting data to an Excel file.
 *
 * @param {ExcelData} headers - The headers for the Excel file.
 * @param {string} data - The data to be exported to the Excel file.
 * @param {string} fileName - The name of the Excel file. Default is "your_file_name.xlsx".
 * @return {void} No return value, exports data to a file instead.
 */
function exportToExcel(
  { headers, data }: ExcelData,
  fileName = "your_file_name.xlsx"
) {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  // 设置表头样式
  worksheet['A1'].s = {
    font: { bold: true },
    alignment: { horizontal: 'center' }
  };

  worksheet["!margins"] = {
    bottom: 10
  }

  // 为数据添加边框
  for (let row = 1; row <= data.length + 1; row++) {
    for (let col = 1; col <= headers.length; col++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell) {
        cell.s = {
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
}


const BaseTable: React.FC<BaseTableProps> = ({ tableProps }) => {

  /**
   * Handles exporting data to an Excel file.
   *
   * @return {void} No return value, exports data to a file instead.
   */
  const handleExport = () => {
    const excelData: ExcelData = {
      headers: ["Name", "Age", "City"],
      data: [
        ["John", 25, "New York"],
        ["Alice", 30, "London"],
        ["Bob", 28, "Paris"],
      ],
    };
    exportToExcel(excelData, "your_file_name.xlsx");
  };

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
                { required: true, message: "Please input your username!" },
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
                { required: true, message: "Please input your username!" },
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
          <Space size={"middle"}>
            <Button type="primary">新增</Button>
            <Tooltip title="导出Excel">
              <DownloadOutlined
                className="cursor-pointer hover:text-red-500"
                onClick={handleExport}
              />
            </Tooltip>

            <Tooltip title="刷新">
              <ReloadOutlined className="cursor-pointer hover:text-red-500" />
            </Tooltip>

            <Tooltip title="密度">
              <ColumnHeightOutlined className="cursor-pointer hover:text-red-500" />
            </Tooltip>

            <Tooltip title="列设置">
              <SettingOutlined className="cursor-pointer hover:text-red-500" />
            </Tooltip>
          </Space>
        </section>

        {/* 表格 */}
        <Table
          {...tableProps}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总计 ${total} 条`,
            ...tableProps.pagination,
          }}
        />
      </section>
    </>
  );
};

export default BaseTable;
