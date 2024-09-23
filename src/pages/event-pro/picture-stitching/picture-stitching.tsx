import { DeleteOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space } from 'antd'
import { type ChangeEvent, useRef, useState } from 'react'

import './css/picture-stitching.css'

function PictureStitching() {
	const imgWrapper = useRef<HTMLDivElement>(null)
	const [srcList, setSrcList] = useState<string[]>([])
	const [copyImgSrc, setCopyImgSrc] = useState<string>('')

	function handleUploadListChange(event: ChangeEvent<HTMLInputElement>): void {
		setSrcList([...srcList, URL.createObjectURL(event.target.files![0])])
	}

	const copyImg = () => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')!
		const images = imgWrapper.current!.getElementsByTagName('img')

		// Get the original dimensions of the images
		const imageDimensions = Array.from(images).map((img) => {
			return {
				width: img.naturalWidth,
				height: img.naturalHeight,
				scaleFactor: 0,
			}
		})

		// Find the smallest width
		const smallestWidth = Math.min(...imageDimensions.map((dim) => dim.width))

		Array.from(images).forEach((img, index) => {
			imageDimensions[index].scaleFactor = smallestWidth / img.naturalWidth
		})

		// Set the canvas width to the smallest width
		canvas.width = smallestWidth

		// Calculate the total height of the scaled images
		const totalHeight = imageDimensions.reduce((acc, dim, index) => {
			return acc + dim.height * imageDimensions[index].scaleFactor
		}, 0)

		// Set the canvas height to the total height
		canvas.height = totalHeight

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		let offsetY = 0
		for (let index = 0, l = images.length; index < l; index++) {
			const scaleFactor = imageDimensions[index].scaleFactor
			const naturalHeight = images[index].naturalHeight

			const scaledWidth = images[index].naturalWidth * scaleFactor
			const scaledHeight = naturalHeight * scaleFactor
			ctx.drawImage(images[index], 0, offsetY, scaledWidth, scaledHeight)

			offsetY += naturalHeight * scaleFactor
		}

		setCopyImgSrc(canvas.toDataURL('image/png'))
	}

	const downloadImg = () => {
		const link = document.createElement('a')
		link.download = 'picture-stitching.png'
		link.href = copyImgSrc
		link.click()
	}

	return (
		<Row className='custom-container'>
			<Col span={12}>
				<input type='file' accept='image/*' onChange={handleUploadListChange} />

				<p>
					<Button type='primary' onClick={() => setSrcList([])}>
						清空
					</Button>
				</p>

				<div className='max-w-[400px] border-2' ref={imgWrapper}>
					{srcList.map((src) => (
						<div className='relative' key={src}>
							<img
								className='img-tocopy'
								src={src}
								alt='上传的图片'
								width='100%'
							/>
							<DeleteOutlined
								className='img-del-btn'
								onClick={() =>
									setSrcList(srcList.filter((item) => item !== src))
								}
							/>
						</div>
					))}
				</div>
			</Col>

			<Col span={12}>
				<Space size='middle'>
					<Button type='primary' onClick={copyImg}>
						复制
					</Button>

					<Button onClick={downloadImg}>下载</Button>
				</Space>

				<img src={copyImgSrc} alt='复制后的图片' />
			</Col>
		</Row>
	)
}

export default PictureStitching
