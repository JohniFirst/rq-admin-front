import { Space } from 'antd'
import { NavLink } from 'react-router-dom'

const ComplexForm: React.FC = () => {
  return (
    <Space size={16}>
      <NavLink to="/event/complex-form/modular-form">模块化表单</NavLink>
      <NavLink to="/event/complex-form/stepped-form">分步表单</NavLink>
    </Space>
  )
}

export default ComplexForm
