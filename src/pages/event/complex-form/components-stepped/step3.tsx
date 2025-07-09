import { Button, Form, Space } from 'antd'

type Step3Props = {
  onPrev: () => void
  onNext: () => void
}

const Step3: React.FC<Step3Props> = ({ onPrev, onNext }) => {
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

export default Step3
