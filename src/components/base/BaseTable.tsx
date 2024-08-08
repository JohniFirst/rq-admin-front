import { Button, Form, Input, Table } from "antd";
import type { FormProps, TableProps } from "antd";

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

const BaseTable: React.FC<BaseTableProps> = ({ tableProps }) => {
  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table
        {...tableProps}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `总计 ${total} 条`,
          ...tableProps.pagination,
        }}
      />
    </>
  );
};

export default BaseTable;
