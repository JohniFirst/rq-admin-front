import { getUploadImageList } from '@/api/api-event'
import albumAdd from '@/assets/svgs/system/album-add.svg'
import albumCover from '@/assets/svgs/system/album-cover.svg'
import UploadCloudAlbum from '@/components/upload-cloud-album'
import { Divider, Form, Image, Input, Modal, Skeleton, Switch } from 'antd'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import DoubleClickEdit from '@/components/base/double-click-edit'
import { AlbumNameMaxLength } from '@/utils/config'
import CloudAlbumStyle from './css/cloud-album.module.css'

enum CloudAlbumItemType {
	ALL = 0,
	ALBUM = 1,
}

/** 云相册管理页面 */
const CloudAlbum = () => {
	const [newAlbumForm] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<CloudAlbumItem[]>([])
	// 新增相册的弹窗是否显示
	const [newAlbumModalVisible, setNewAlbumModalVisible] = useState(false)

	const [defaultActive, setDefaultActive] = useState<CloudAlbumItemType>(
		CloudAlbumItemType.ALBUM,
	)

	const loadMoreData = async () => {
		if (loading) {
			return
		}
		try {
			setLoading(true)

			const res = await getUploadImageList({ current: 1, pageSize: 10 })

			setData([...data, ...res])
			setLoading(false)
		} catch {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadMoreData()
	}, [])

	const addNewAlbum = () => {
		setNewAlbumModalVisible(true)
	}

	// 所有图片
	const AllCloudImage = () => {
		return (
			<div id='scrollableDiv'>
				<InfiniteScroll
					className='columns-5'
					scrollableTarget='scrollableDiv'
					dataLength={data.length}
					next={loadMoreData}
					hasMore={data.length < 50}
					loader={<Skeleton paragraph={{ rows: 2 }} active />}
					endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
				>
					<Image.PreviewGroup items={data.map((item) => item.src)}>
						{data.map((item) => (
							<Image
								className='break-inside-avoid'
								key={item.id}
								src={item.src}
								width='100%'
							/>
						))}
					</Image.PreviewGroup>
				</InfiniteScroll>
			</div>
		)
	}

	const updateAlbumName = (newName: string) => {
		// TODO: 增加更新相册名字的接口
		console.log('新相册名字:', newName)
	}

	const onCreateAlbum = (values: NewAlbumFormItems) => {
		console.log('新增相册表单值：', values)
		setNewAlbumModalVisible(false)
	}

	// 相册
	const AlbumPage = () => {
		return (
			<>
				<ul className='grid gap-4 2xl:grid-cols-12 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3'>
					<li className='h-36 hover:bg-slate-100 rounded-xl'>
						<img src={albumCover} alt='相册封面' />
						<div className='text-sm text-center'>
							<DoubleClickEdit
								value='这是相册名字'
								inputProps={{ maxLength: AlbumNameMaxLength }}
								editFinished={(value) => updateAlbumName(value)}
							/>
						</div>
					</li>

					<li
						className='h-36 cursor-pointer hover:bg-slate-100 rounded-xl'
						onClick={addNewAlbum}
						onKeyUp={addNewAlbum}
					>
						<img src={albumAdd} alt='相册封面' />
					</li>
				</ul>

				<Modal
					open={newAlbumModalVisible}
					title='创建新相册'
					okText='立即创建'
					cancelText='取消'
					okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
					onCancel={() => setNewAlbumModalVisible(false)}
					destroyOnClose
					modalRender={(dom) => (
						<Form
							layout='vertical'
							form={newAlbumForm}
							name='cloud-album-form'
							initialValues={{ modifier: 'public' }}
							clearOnDestroy
							onFinish={(values) => onCreateAlbum(values)}
							scrollToFirstError={true}
						>
							{dom}
						</Form>
					)}
				>
					<Form.Item<NewAlbumFormItems>
						name='cover'
						label='封面'
						rules={[{ required: true, message: '请上传' }]}
					>
						<Input placeholder='选择相册封面' />
					</Form.Item>

					<Form.Item<NewAlbumFormItems>
						name='name'
						label='相册名称'
						rules={[{ required: true, message: '请输入' }]}
					>
						<Input
							placeholder='最长10个字符'
							maxLength={10}
							allowClear
							showCount
						/>
					</Form.Item>

					<Form.Item<NewAlbumFormItems> name='description' label='相册描述'>
						<Input.TextArea
							placeholder='这里面都放的是什么类型的照片'
							showCount
						/>
					</Form.Item>

					<Form.Item<NewAlbumFormItems>
						name='isPublic'
						label='是否公开'
						rules={[{ required: true, message: '请选择' }]}
					>
						<Switch defaultChecked />
					</Form.Item>
				</Modal>
			</>
		)
	}

	return (
		<div className='custom-container'>
			<h2>这是云相册页面</h2>
			<p>这是介绍</p>
			<UploadCloudAlbum />

			<section className={CloudAlbumStyle.albumTitle}>
				<p
					className={
						defaultActive === CloudAlbumItemType.ALL
							? CloudAlbumStyle.albumTitleActive
							: ''
					}
					onClick={() => setDefaultActive(CloudAlbumItemType.ALL)}
					onKeyUp={() => setDefaultActive(CloudAlbumItemType.ALL)}
				>
					所有照片
				</p>
				<p
					className={
						defaultActive === CloudAlbumItemType.ALBUM
							? CloudAlbumStyle.albumTitleActive
							: ''
					}
					onClick={() => setDefaultActive(CloudAlbumItemType.ALBUM)}
					onKeyUp={() => setDefaultActive(CloudAlbumItemType.ALBUM)}
				>
					相册
				</p>
			</section>

			{defaultActive === CloudAlbumItemType.ALL ? (
				<AllCloudImage />
			) : (
				<AlbumPage />
			)}
		</div>
	)
}

export default CloudAlbum
