import { getUploadImageList } from '@/api/api-event'
import UploadCloudAlbum from '@/components/upload-cloud-album'
import { Divider, Image, Skeleton } from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import albumAdd from '@/assets/svgs/system/album-add.svg'
import albumCover from '@/assets/svgs/system/album-cover.svg'

import { AlbumNameMaxLength } from '@/utils/config'
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

	const updateAlbumName = (e: React.ChangeEvent<HTMLParagraphElement>) => {
		// TODO 更新相册名字接口
		console.log(e.target.innerText)
	}

	const handleKeyboardSave = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
		// TODO 更新相册名字接口
		const target = e.target as HTMLParagraphElement

		console.log(!!window.getSelection()?.toString())

		// 限制相册名最大长度为10
		if (target.textContent!.length > AlbumNameMaxLength - 1) {
			target.textContent = target.textContent!.slice(0, AlbumNameMaxLength)
			if (
				!['Backspace', 'Delete'].includes(e.key) &&
				!window.getSelection()?.toString()
			) {
				e.preventDefault()
			}
			return
		}

		if (e.key === 'Enter') {
			e.preventDefault()

			target.blur()
		}
	}

	// 相册
	const AlbumPage = () => {
		return (
			<ul className='grid gap-4 2xl:grid-cols-12 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3'>
				<li className='h-36'>
					<img src={albumCover} alt='相册封面' />
					<p
						className='text-sm text-center'
						suppressContentEditableWarning
						contentEditable={'plaintext-only'}
						onBlur={updateAlbumName}
						onKeyDown={handleKeyboardSave}
					>
						这里是相册名字
					</p>
				</li>

				<li
					className='h-36 cursor-pointer'
					onClick={addNewAlbum}
					onKeyUp={addNewAlbum}
				>
					<img src={albumAdd} alt='相册封面' />
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
