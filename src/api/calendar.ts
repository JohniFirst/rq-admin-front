import { http } from '@/utils/http'

export interface CalendarEventApiItem {
	id: number
	event: string // JSON 字符串
	start: string
	end: string
	title: string
	createdAt: string
	updatedAt: string
}

type CalendarListParams = {
	year: number
	month: number
	event?: string
}

/** 查询某年某月的所有日历事件 */
export function getEventsList(params: CalendarListParams): Promise<CalendarEventApiItem[]> {
	return http.get('/event/calendar', { params })
}

/** 编辑/新增日历事件 */
export function handleEvents(data: { event: string }) {
	return http.post('/event/calendar', data)
}

/** 添加日程 */
export function addEvent(data: any): Promise<CloudAlbumItem[]> {
	return http.post('/event/add', data)
}
