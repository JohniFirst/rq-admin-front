import { type FC, useState } from "react"
import { Button, Form, Input, Modal, Upload, message } from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import { type UploadChangeParam } from "antd/es/upload";

type UploadCloudAlbumProps = {
  uploadButtonText?: string
}

/**
 * 通用云相册上传组件
 * @param uploadButtonText 上传按钮的文字 
 */
const UploadCloudAlbum: FC<UploadCloudAlbumProps> = ({ uploadButtonText }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  }

  const onCreate = (values: CloudAlbumItem) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  const onUploadChange = (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  return (
    <>
      <Button type="primary" onClick={toggleModal} onKeyUp={toggleModal}>{uploadButtonText || '上传云相册'}</Button>

      <Modal
        open={open}
        title="云相册上传"
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="horizontal"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<CloudAlbumItem>
          name="name"
          label="标题"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="照片标题" />
        </Form.Item>

        <Form.Item<CloudAlbumItem> name="description" label="描述" rules={[{ required: true, message: '请输入' }]}>
          <Input.TextArea rows={4} placeholder="照片描述" />
        </Form.Item>

        <Upload.Dragger name='file'
          multiple={true}
          action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
          onChange={onUploadChange}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Upload.Dragger>
      </Modal >
    </>
  )
}

export default UploadCloudAlbum