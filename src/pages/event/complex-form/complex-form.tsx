import { Space } from 'antd'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Ol = styled.ol`
  list-style: decimal;
  padding-left: 30px;

  li {
    margin-bottom: 12px;
  }
`

const ComplexForm: React.FC = () => {
  return (
    <>
      <Space size={16}>
        <NavLink to="/event/complex-form/modular-form">模块化表单</NavLink>
        <NavLink to="/event/complex-form/stepped-form">分步表单</NavLink>
      </Space>

      <h2 className="my-[16px]">模块化表单介绍</h2>
      <Ol>
        <li>
          充分利用组件化思想，antd官方组件设计的时候就将表单和表单项设置成了不同的组件，这就意味着，表单和表单项其实可以不用非要在同一文件内，这对很复杂的表单很有效
        </li>
        <li>按模块将很复杂的表单拆分到不同的文件里面去管理，方便维护</li>
        <li>
          表单之间的联动使用antd设计好的useWatch、useFormList等hook，可以很方便的实现表单之间的联动
        </li>
        <li>表单实例使用 Form.useForm()获取，或者是使用参数的形式从父组件传入，方便整个表单联动</li>
        <li>
          antd设计了很好的一套api，就是为了应对复杂的表单，不要局限于官网示例的用法，非要将一个复杂表单写几千上万行代码到同一文件内
        </li>
      </Ol>

      <h2 className="my-[16px]">分步表单介绍</h2>
      <Ol>
        <li>
          分步表单同样理由的是函数式组件化思想，它更胜一筹的是，可以对单独每一步的表单进行单独验证，当然，也可以整体验证，灵活性很高
        </li>
        <li>
          在不同步骤的表单之间切换时，注意使用浏览器本地化存储提升用户体验，可以使用localforage自动对本地存储进行适配，现代浏览器使用容量更大的indexDb
        </li>
      </Ol>
    </>
  )
}

export default ComplexForm
