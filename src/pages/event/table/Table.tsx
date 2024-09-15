import BaseTable from '@/components/base/base-table'
import { Button, Space, type TableProps, Tag } from 'antd'

interface DataType {
	key: string
	name: string
	age: number
	address: string
	tags: string[]
}

const columns: TableProps<DataType>['columns'] = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		// render: (text) => text,
	},
	{
		title: 'Age',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: 'Tags',
		key: 'tags',
		dataIndex: 'tags',
		render: (_, { tags }) => (
			<>
				{tags.map((tag) => {
					let color = tag.length > 5 ? 'geekblue' : 'green'
					if (tag === 'loser') {
						color = 'volcano'
					}
					return (
						<Tag color={color} key={tag}>
							{tag.toUpperCase()}
						</Tag>
					)
				})}
			</>
		),
	},
	{
		title: 'Action',
		key: 'action',
		render: (_, record) => (
			<Space size='middle'>
				<Button type='text'>Invite {record.name}</Button>
				<Button type='text'>Delete</Button>
			</Space>
		),
	},
]

const dataSource: DataType[] = [
	{
		key: '1',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer'],
	},
	{
		key: '2',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		tags: ['loser'],
	},
	{
		key: '3',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
		tags: ['cool', 'teacher'],
	},
]

function Table() {
	return (
		<BaseTable
			tableProps={{
				columns,
				dataSource,
			}}
			searchProps={{}}
		/>
	)
}

export default Table
