import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'
import { addMenu, getMenuList, getRoleEnumList } from '@/api/system-api'
import { menuUrls } from '@/routes/dynamic-routes'

type MenuAddFormProps = {
  onRefresh: () => void
  children?: string
  initialValues?: MenuApiResponse
}

/** 新增菜单的表单 */
const MenuAddForm = ({ onRefresh, children, initialValues }: MenuAddFormProps) => {
  const [rolesList, setRolesList] = useState<SelectOptions[]>([])
  const [parentMenuOptions, setParentMenuOptions] = useState<SelectOptions[]>([])
  // 新增菜单的弹窗是否打开
  const [open, setOpen] = useState(false)
  // 表单实例
  const [form] = Form.useForm()

  useEffect(() => {
    getRoleList()
    getParentMenuOptions()
  }, [form])

  // 编辑时初始化设置表单值
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [open, initialValues])

  const getParentMenuOptions = async () => {
    const res = await getMenuList()
    setParentMenuOptions(
      res.map((item: MenuApiResponse) => ({ label: item.title, value: item.id })),
    )
  }

  const getRoleList = async () => {
    const res = await getRoleEnumList()

    setRolesList(res)
  }

  const getMenuUrlOptions = () => {
    if (Array.isArray(menuUrls) && menuUrls.length > 0) {
      return menuUrls.map(
        url => (typeof url === 'string' ? { label: url, value: url } : url), // 如果 menuUrls 已经是 {label, value} 结构
      )
    }
    return []
  }

  const onCreate = async (values: MenuApiResponse) => {
    await addMenu(values)

    message.success('新增成功')
    onRefresh()
    setOpen(false)
    form.resetFields()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} type="primary">
        {children ?? '新增'}
      </Button>

      <Modal
        open={open}
        title="新增菜单"
        okText="新增"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        maskClosable={false}
        modalRender={dom => (
          <Form
            form={form}
            name="menu_add_form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            onFinish={values => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item<MenuApiResponse>
          label="菜单名"
          name="title"
          rules={[{ required: true, message: '请输入菜单名' }]}
        >
          <Input placeholder="请输入菜单名" />
        </Form.Item>

        <Form.Item<MenuApiResponse>
          label="角色"
          name="roles"
          rules={[{ required: false, message: '请选择角色' }]}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            options={rolesList}
            placeholder="请选择角色"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<MenuApiResponse> label="路由" name="url">
          <Select
            allowClear
            showSearch
            placeholder="请输入路由"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={getMenuUrlOptions()}
          />
        </Form.Item>

        {/* <Form.Item<MenuApiResponse>
				label='图标'
				name='icon'
				rules={[{ required: true, message: '请选择图标' }]}
			>
				<Select
					options={LucideIconList.map((name) => ({ label: name, value: name }))}
					labelRender={(option) => (
						<LucideIcon name={option.label as LucideIconType} />
					)}
					optionRender={(options) => (
						<LucideIcon name={options.label as LucideIconType} />
					)}
				/>
			</Form.Item> */}

        <Form.Item<MenuApiResponse> label="父级菜单" name="parent">
          <Select
            allowClear
            showSearch
            placeholder="请选择父级菜单（一级菜单可不选）"
            options={parentMenuOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item<MenuApiResponse> label="排序" name="menuOrder">
          <InputNumber min={0} placeholder="升序排序" />
        </Form.Item>
      </Modal>
    </>
  )
}

export default MenuAddForm
