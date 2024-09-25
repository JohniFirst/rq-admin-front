import { getUploadImageList } from '@/api/api-event'
import UploadCloudAlbum from '@/components/upload-cloud-album'
import { Divider, Image, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import CloudAlbumStyle from './css/cloud-album.module.css'

enum CloudAlbumItemType {
	ALL = 0,
	ALBUM = 1,
}

/** 云相册管理页面 */
const CloudAlbum = () => {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<CloudAlbumItem[]>([])

	const [defaultActive, setDefaultActive] = useState<CloudAlbumItemType>(
		CloudAlbumItemType.ALBUM,
	)

	const toggleDefaultActive = () => {
		setDefaultActive(
			defaultActive === CloudAlbumItemType.ALL
				? CloudAlbumItemType.ALBUM
				: CloudAlbumItemType.ALL,
		)
	}

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
		console.log('新增相册')
	}

	// 所有图片
	const AllCloudImage = () => {
		return (
			<>
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
			</>
		)
	}

	const updateAlbumName = (e: React.ChangeEvent<HTMLParagraphElement>) => {
		console.log(e.target.innerText)
	}

	const handleKeyboardSave = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
		if (e.key === 'Enter') {
			const target = e.target as HTMLParagraphElement

			target.blur()
		}
	}

	// 相册
	const AlbumPage = () => {
		return (
			<ul className='grid gap-4 2xl:grid-cols-12 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3'>
				<li className='h-36 bg-red-500'>
					<p>这里放相册封面</p>
					<p
						suppressContentEditableWarning
						contentEditable
						onBlur={updateAlbumName}
						onKeyUp={handleKeyboardSave}
					>
						这里是相册名字
					</p>
				</li>
				<li
					className='h-36 bg-red-500'
					onClick={addNewAlbum}
					onKeyUp={addNewAlbum}
				>
					新增
				</li>
			</ul>
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
					onClick={toggleDefaultActive}
					onKeyUp={toggleDefaultActive}
				>
					所有照片
				</p>
				<p
					className={
						defaultActive === CloudAlbumItemType.ALBUM
							? CloudAlbumStyle.albumTitleActive
							: ''
					}
					onClick={toggleDefaultActive}
					onKeyUp={toggleDefaultActive}
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
