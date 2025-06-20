import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { getRoleEnumList } from '@/api/system-api'
import { menuUrls } from '@/routes/dynamic-routes'

/** 新增菜单的表单 */
const MenuAddForm = () => {
	const [rolesList, setRolesList] = useState<SelectOptions[]>([])

	useEffect(() => {
		getRoleList()
	}, [])

	const getRoleList = async () => {
		const res = await getRoleEnumList()

		setRolesList(res)
	}
	return (
		<>
			<Row>
				<Col span={12}>
					<Form.Item<MenuAddFormFields>
						label='菜单名'
						name='title'
						rules={[{ required: true, message: '请输入菜单名' }]}
					>
						<Input placeholder='请输入菜单名' />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item<MenuAddFormFields> label='角色' name='roles' rules={[{ required: true, message: '请选择角色' }]}>
						<Select
							mode='multiple'
							allowClear
							showSearch
							options={rolesList}
							placeholder='请选择角色'
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item<MenuAddFormFields> label='路由' name='url'>
				<Select
					allowClear
					showSearch
					placeholder='请输入路由'
					filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
					options={menuUrls}
				/>
			</Form.Item>

			{/* <Form.Item<MenuAddFormFields>
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

			<Row>
				<Col span={12}>
					<Form.Item<MenuAddFormFields> label='父级菜单ID' name='parent'>
						<InputNumber className='w-full' placeholder='一级菜单可以不填' />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item<MenuAddFormFields> label='排序' name='menuOrder'>
						<InputNumber placeholder='升序排序' />
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

export default MenuAddForm
