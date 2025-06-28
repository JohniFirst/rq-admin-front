import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons'
import {
  Button,
  FloatButton,
  Form,
  Input,
  Modal,
  message,
  type StepProps,
  Steps,
  Upload,
} from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import { type FC, useState } from 'react'

const steps: StepProps[] = [
  {
    title: '上传照片',
    description: '照片的基本要素',
  },
  {
    title: '选择相册',
    description: '文件夹式管理',
  },
]

const onUploadChange = (info: UploadChangeParam) => {
  const { status } = info.file
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

/**
 * 通用云相册上传组件
 * @prop uploadButtonText 上传按钮的文字
 */
const UploadCloudAlbum: FC<UploadCloudAlbumProps> = () => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  // 当前步骤
  const [current, setCurrent] = useState(0)

  const toggleModal = () => {
    setOpen(!open)
  }

  const onCreate = (values: CloudAlbumItem) => {
    console.log('Received values of form: ', values)
    setOpen(false)
  }

  // 切换步骤 0: 上传照片 1: 选择相册
  const toggleStep = () => {
    setCurrent(current === 0 ? 1 : 0)
  }

  return (
    <>
      <FloatButton.Group>
        <FloatButton
          type="primary"
          onClick={toggleModal}
          icon={<CloudUploadOutlined />}
          onKeyUp={toggleModal}
        />
        <FloatButton.BackTop />
      </FloatButton.Group>

      <Modal
        open={open}
        title="云相册上传"
        footer={[
          <Button key="cancel" onClick={toggleModal}>
            取消
          </Button>,
          <Button key="back" type="primary" onClick={toggleStep}>
            {current === 0 ? '下一步' : '上一步'}
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="cloud-album-form">
            立即上传
          </Button>,
        ]}
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="cloud-album-form"
            clearOnDestroy
            onFinish={values => onCreate(values)}
            scrollToFirstError={true}
          >
            {dom}
          </Form>
        )}
      >
        <Steps className="mb-4" current={current} items={steps} />

        <section className={current === 0 ? '' : 'hidden'}>
          <Upload.Dragger
            name="file"
            multiple={true}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            onChange={onUploadChange}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖动文件到此区域上传</p>
            <p className="ant-upload-hint">支持单个或批量上传。严禁上传公司数据或其他违禁文件。</p>
          </Upload.Dragger>

          <div className="h-4" />

          <Form.Item<CloudAlbumItem>
            name="name"
            label="标题"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="照片标题" />
          </Form.Item>

          <Form.Item<CloudAlbumItem>
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input.TextArea rows={4} placeholder="照片描述" />
          </Form.Item>
        </section>

        <section className={current === 1 ? '' : 'hidden'}>
          <Form.Item<CloudAlbumItem>
            name="album"
            label="相册"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请选择相册" />
          </Form.Item>
        </section>
      </Modal>
    </>
  )
}

export default UploadCloudAlbum
