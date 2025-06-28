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

export type CalendarListParams = {
  start: string
  end: string
  event?: string
}

/** 查询某年某月的所有日历事件 */
export function getEventsList(params: CalendarListParams): Promise<CalendarEventApiItem[]> {
  return http.get('/event/calendar', { params })
}

/** 新增日历事件 */
export function addEvents(data: { event: string }) {
  return http.post('/event/calendar', data)
}

/** 编辑日历事件 */
export function editEvents(data: { event: string }) {
  return http.put('/event/calendar', data)
}

/** 删除日历事件 */
export function deleteEvents(id: number): Promise<void> {
  return http.delete('/event/calendar/' + id)
}
