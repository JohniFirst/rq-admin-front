import { getMenuList, getRoleEnumList } from '@/api/system-api'
import { menuUrls } from '@/routes/dynamic-routes'
import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { useEffect, useState } from 'react'

/** 新增菜单的表单 */
const MenuAddForm = () => {
	const [rolesList, setRolesList] = useState<SelectOptions[]>([])
	const [parentMenuOptions, setParentMenuOptions] = useState<SelectOptions[]>([])

	useEffect(() => {
		getRoleList()
		getParentMenuOptions()
	}, [])

	const getRoleList = async () => {
		const res = await getRoleEnumList()

		setRolesList(res)
	}

	const getParentMenuOptions = async () => {
		const res = await getMenuList()
		if (Array.isArray(res)) {
			setParentMenuOptions(res.map((item: any) => ({ label: item.title, value: item.id })))
		} else if (res?.data && Array.isArray(res.data)) {
			setParentMenuOptions(res.data.map((item: any) => ({ label: item.title, value: item.id })))
		}
	}

	const getMenuUrlOptions = () => {
		if (Array.isArray(menuUrls) && menuUrls.length > 0) {
			return menuUrls.map(
				(url) => (typeof url === 'string' ? { label: url, value: url } : url), // 如果 menuUrls 已经是 {label, value} 结构
			)
		}
		return []
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
					<Form.Item<MenuAddFormFields> label='角色' name='roles' rules={[{ required: false, message: '请选择角色' }]}>
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
					options={getMenuUrlOptions()}
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
					<Form.Item<MenuAddFormFields> label='父级菜单' name='parent'>
						<Select
							allowClear
							showSearch
							placeholder='请选择父级菜单（一级菜单可不选）'
							options={parentMenuOptions}
							filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
						/>
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
