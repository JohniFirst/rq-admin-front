import { Button, Form } from 'antd'

type Step4Props = {
  onPrev: () => void
}

const Step4: React.FC<Step4Props> = ({ onPrev }) => {
  return (
    <Form>
      <Form.Item>
        <Button type="primary" onClick={onPrev}>
          上一步
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Step4
