import React, { useState } from 'react'
import { Button, message, Steps } from 'antd'
import type { StepsProps } from 'antd'
import { CheckOutlined, CoffeeOutlined, EditOutlined, ProjectOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import Step1 from './components-stepped/step1'
import Step2 from './components-stepped/step2'
import Step3 from './components-stepped/step3'
import Step4 from './components-stepped/step4'

const items: StepsProps['items'] = [
  {
    title: '表单第一步',
    subTitle: '副标题',
    description: '常规表单登记基础信息',
    icon: <CoffeeOutlined />,
  },
  {
    title: '表单第二步',
    subTitle: '副标题',
    description: '上传表单登记附件',
    icon: <ProjectOutlined />,
  },
  {
    title: '表单第三步',
    subTitle: '副标题',
    description: '提供富文本编辑器编辑个性化内容',
    icon: <EditOutlined />,
  },
  {
    title: '恭喜你，表单填写完成',
    subTitle: '副标题',
    description: '对表单内容进行确认',
    icon: <CheckOutlined />,
  },
]

const SteppedWp = styled.div`
  margin-top: 16px;
  padding: 24px 16px;
  background-color: rgb(187 179 179 / 45%);
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`

const SteppedForm: React.FC = () => {
  // const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <>
      <Steps current={current} items={items} />

      <SteppedWp>
        {current === 0 && <Step1 />}
        {current === 1 && <Step2 />}
        {current === 2 && <Step3 />}
        {current === 3 && <Step4 />}
      </SteppedWp>

      <div style={{ marginTop: 24 }}>
        {current < items.length - 1 && (
          <Button type="primary" onClick={next}>
            下一步
          </Button>
        )}
        {current === items.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            提交
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            上一步
          </Button>
        )}
      </div>
    </>
  )
}

export default SteppedForm
