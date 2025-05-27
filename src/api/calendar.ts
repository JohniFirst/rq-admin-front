import { http } from '@/utils/http'

/** 获取日程列表 */
export function getEventsList(): Promise<CloudAlbumItem[]> {
	return http.post('/event/list', { test: '注意，我修改参数了哦' })
}

/** 添加日程 */
export function addEvent(data: any): Promise<CloudAlbumItem[]> {
	return http.post('/event/add', data)
}
