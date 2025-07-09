import { Button, Form, Space } from 'antd'

type Step2Props = {
  onNext: () => void
  onPrev: () => void
}

const Step2: React.FC<Step2Props> = ({ onNext, onPrev }) => {
  return (
    <Form>
      <Form.Item>
        <Space size={16}>
          <Button type="primary" onClick={onPrev}>
            上一步
          </Button>
          <Button type="primary" onClick={onNext}>
            下一步
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Step2
