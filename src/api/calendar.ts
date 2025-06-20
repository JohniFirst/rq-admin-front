import { http } from '@/utils/http'

type CalendarListParams = {
	year: number
	month: number
	event?: string
}

/** 查询某年某月的所有日历事件 */
export function getEventsList(params: CalendarListParams) {
	return http.get('/event/calendar', { params })
}

/** 编辑/新增日历事件 */
export function handleEvents(data: { event: string }) {
	return http.post('/event/calendar', { data })
}

/** 添加日程 */
export function addEvent(data: any): Promise<CloudAlbumItem[]> {
	return http.post('/event/add', data)
}
