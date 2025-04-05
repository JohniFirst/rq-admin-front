import type { BaseOptionType } from 'antd/es/select'
import { Suspense, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const dynamicFiles = import.meta.glob(['../pages/**/*.tsx'])

const lazyElement = (Element: React.LazyExoticComponent<() => JSX.Element>) => (
	<Suspense fallback={<p>loading</p>}>
		<Element />
	</Suspense>
)

function createRoute(path: string): RouteObject {
	// 移除路径中的 'views' 和 '.tsx'，并将路径转换为小写
	let routePath = path.replace(/(\.\.\/pages|\.tsx)/g, '').toLowerCase()

	// 分割路径为文件名数组
	const fileNames = routePath.split('/')
	let name = fileNames[fileNames.length - 1]

	// 如果文件名与上一级目录名相同，则移除文件名
	if (fileNames[fileNames.length - 1] === fileNames[fileNames.length - 2]) {
		fileNames.pop()
		routePath = fileNames.join('/')
	}

	// 处理动态路径部分
	const dynamicPartMatches = path.match(/\[([^[\]]+)\]/g)
	if (dynamicPartMatches) {
		name = name.replace(dynamicPartMatches.join(''), '')
		for (const match of dynamicPartMatches) {
			const dynamicValue = match.slice(1, -1)
			routePath = routePath.replace(`[${dynamicValue}]`, `/:${dynamicValue}`)
		}
	}

	// @ts-ignore
	const LazyElement = lazy(dynamicFiles[path])

	// 创建路由对象
	return {
		path: routePath,
		// key: name,
		element: lazyElement(
			LazyElement as React.LazyExoticComponent<() => JSX.Element>,
		),
	}
}

/**
 * 生成动态路由
 * @returns 动态路由
 */
export function generateRoutes() {
	const dynamicRoutes: RouteObject[] = []

	for (const path in dynamicFiles) {
		if (path.includes('components')) {
			continue
		}

		dynamicRoutes.push(createRoute(path))
	}

	return dynamicRoutes
}

export const menuUrls: BaseOptionType[] = []
