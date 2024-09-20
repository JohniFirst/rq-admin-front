import type { RouteObject } from 'react-router-dom'

import Layout from '@/layout/Layout'
import Dashboard from '@/pages/dashboard/Dashboard'
import ShareAnimationDetail from '@/pages/event-pro/animate/share-animation-detail/share-animation-detail'
import ShareAnimation from '@/pages/event-pro/animate/share-animation/share-animation'
import Danmu from '@/pages/event-pro/danmu/Danmu'
import PictureStitching from '@/pages/event-pro/picture-stitching/picture-stitching'
import VideoPlayer from '@/pages/event-pro/video-player/video-player'
import CopyToClipboard from '@/pages/event/clipboard/copy-to-clipboard'
import TableFrontend from '@/pages/event/table-frontend/TableFrontend'
import Table from '@/pages/event/table/Table'
// import Menu from '@/pages/system/menu/Menu'
import Role from '@/pages/system/role/Role'
import UserInfo from '@/pages/system/user-info/user-info'
import User from '@/pages/system/user/User'

export const dynamicRoutes: RouteObject[] = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/dashboard',
				index: true,
				element: <Dashboard />,
				loader: () => {
					return new Promise((resolve) => {
						resolve('dashboard')
					})
				},
			},
			{
				path: '/event',
				children: [
					{
						path: 'table',
						element: <Table />,
					},
					{
						path: 'cloud-album',
						lazy: () => import("@/pages/event/cloud-album/cloud-album.tsx").then((module) => ({
						  element: <module.default />,
						})),
					},
					{
						path: 'table-frontend',
						element: <TableFrontend />,
					},
					{
						path: 'copy-to-clipboard',
						element: <CopyToClipboard />,
					},
				],
			},
			{
				path: '/event-pro',
				children: [
					{
						path: 'danmu',
						element: <Danmu />,
					},
					{
						path: 'video-player',
						element: <VideoPlayer />,
					},
					{
						path: 'picture-stitching',
						element: <PictureStitching />,
						// lazy: () => import("@/pages/event-pro/picture-stitching/picture-stitching").then((module) => ({
						//   element: <module.default />,
						// })),
					},
					{
						path: 'animate',
						children: [
							{
								path: 'share-animation',
								element: <ShareAnimation />,
							},
							{
								path: 'share-animation-detail',
								element: <ShareAnimationDetail />,
							},
						],
					},
				],
			},
			{
				path: '/system',
				children: [
					{
						path: 'user',
						element: <User />,
					},
					{
						path: 'role',
						element: <Role />,
					},
					// {
					// 	path: 'menu',
					// 	element: <Menu />,
					// },
					{ path: 'user-info', element: <UserInfo /> },
				],
			},
		],
	},
]

const pagesComponent = import.meta.glob('../pages/**/*.tsx')

const menus = []
// 供菜单选择界面使用
const menuUrls: SelectOptions[] = []
for (let i = 0, length = Object.keys(pagesComponent).length; i < length; i++) {
	const originPath = Object.keys(pagesComponent)[i]
	if (originPath.includes('components')) {
		continue
	}
	const path = originPath.replace('../pages', '').replace('.tsx', '')

	menus.push({
		path,
		element: pagesComponent[originPath](),
	})

	menuUrls.push({ value: path, label: path })
}

export { menuUrls, menus }
