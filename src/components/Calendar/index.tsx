import type { DateSelectArg, EventClickArg, EventDropArg, EventInput, EventMountArg } from '@fullcalendar/core'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type EventResizeDoneArg } from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Card, Form, Modal, message } from 'antd'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect, useState } from 'react'
import './calendar.css'
import { editEvents, getEventsList } from '@/api/calendar'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/animations/scale.css' // optional for animations
import 'tippy.js/themes/light.css' // optional for themes
import DetailModal from './detail-modal'
import EventModal from './event-modal'

const eventRepeatOptions = {
	none: '不重复',
	daily: '每天',
	weekly: '每周',
	monthly: '每月',
	yearly: '每年',
	hourly: '每小时',
	minutely: '每分钟',
	secondly: '每秒',
}

export type RepeatType = keyof typeof eventRepeatOptions

interface EventFormData {
	title: string
	startDate: dayjs.Dayjs
	endDate: dayjs.Dayjs
	description?: string
	color: string
	repeat: RepeatType
	reminder: boolean
	interval?: number // 重复间隔
	byweekday?: number[] // 周几
	bymonthday?: number[] // 月几号
	count?: number // 重复次数
	until?: dayjs.Dayjs // 截止日期
}

interface CustomEventInput extends EventInput {
	daysOfWeek?: number[]
	startTime?: string
	endTime?: string
	interval?: number
	byweekday?: number[]
	bymonthday?: number[]
	count?: number
	until?: string
}

const Calendar: React.FC = () => {
	const [events, setEvents] = useState<CustomEventInput[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<CustomEventInput | null>()
	const [form] = Form.useForm<EventFormData>()
	const [_selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)
	const [isEditMode, setIsEditMode] = useState(false)
	const [selectedOccurrenceDate, setSelectedOccurrenceDate] = useState<Date | undefined>(undefined)

	// 检查今天的提醒
	useEffect(() => {
		const today = dayjs().startOf('day')
		const todayEvents = events.filter((event) => {
			const eventDate = dayjs(event.start as Date)
			return eventDate.isSame(today, 'day') && event.extendedProps?.reminder
		})

		if (todayEvents.length > 0) {
			Modal.info({
				title: '今日提醒',
				content: (
					<div>
						<p>今天有以下日程：</p>
						<ul>
							{todayEvents.map((event) => (
								<li key={event.id}>
									{event.title} - {dayjs(event.start as Date).format('HH:mm')}
								</li>
							))}
						</ul>
					</div>
				),
				okText: '知道了',
			})
		}
	}, [events])

	useEffect(() => {
		getList()
	}, [])

	const getList = async () => {
		try {
			const now = dayjs()
			const res = await getEventsList({
				year: now.year(),
				month: now.month() + 1,
			})
			console.log('接口返回的数据', res)

			const apiEvents = res // 兼容直接返回数组和data字段
			const parsedEvents = apiEvents.map((item: any) => {
				let parsed: any = {}
				try {
					parsed = JSON.parse(item.event)
				} catch {}
				const repeat = parsed && typeof parsed === 'object' && 'repeat' in parsed ? (parsed.repeat ?? 'none') : 'none'
				// 如果 repeat 为 'none'，移除 rrule 字段，防止无效 freq
				if (repeat === 'none' && parsed.rrule) {
					delete parsed.rrule
				}
				parsed.id = item.id
				return parsed
			})
			setEvents(parsedEvents)
		} catch (e) {
			setEvents([])
		}
	}

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedDate(selectInfo)
		form.setFieldsValue({
			startDate: dayjs(selectInfo.start),
			endDate: dayjs(selectInfo.end),
			repeat: 'none',
			reminder: true,
			color: '#1890ff',
		})
		setIsEditMode(false)
		setIsModalVisible(true)
	}

	const handleEventClick = (info: EventClickArg) => {
		// 这里假设 info.event.start 是 occurrence 的实际发生时间
		setSelectedEvent(Object.assign(info.event, info.event.extendedProps) as CustomEventInput)
		setSelectedOccurrenceDate(info.event.start ? new Date(info.event.start) : undefined)
		setIsDetailModalVisible(true)
	}

	const handleDetailEdit = () => {
		if (selectedEvent) {
			form.setFieldsValue({
				title: selectedEvent.title,
				startDate: dayjs(selectedEvent.start as Date),
				endDate: dayjs(selectedEvent.end as Date),
				description: selectedEvent.description,
				color: selectedEvent.backgroundColor as string,
				repeat: selectedEvent.extendedProps?.repeat || 'none',
				reminder: selectedEvent.extendedProps?.reminder || false,
			})
			setIsEditMode(true)
			setIsDetailModalVisible(false)
			setIsModalVisible(true)
		}
	}

	function handleEventDidMount(mountArg: EventMountArg): void {
		const { event, el, view } = mountArg
		const title = event.title || '无标题'
		let start = ''
		if (event.allDay) {
			const startDate = dayjs(event.start as Date).format('YYYY-MM-DD')
			const endDate = dayjs(event.end as Date).format('YYYY-MM-DD')
			start = `${startDate} 至 ${endDate}`
		} else {
			const startTime = dayjs(event.start as Date).format('HH:mm')
			const endTime = dayjs(event.end as Date).format('HH:mm')
			start = `${startTime} 至 ${endTime}`
		}

		tippy(el, {
			content: `
				<div>
					<h4>${title}</h4>
					<p>${start}</p>
				</div>
			`,
			allowHTML: true,
			theme: 'light',
			animation: 'scale',
			placement: view.type === 'dayGridMonth' ? 'auto' : 'left',
		})
	}

	// 拖拽和缩放事件依然在主组件处理
	const handleEventDrop = async (info: EventDropArg) => {
		try {
			const eventObj = events.find((e) => Number(e.id) === Number(info.event.id))
			if (!eventObj) throw new Error('事件未找到')
			const updatedEvent = {
				...eventObj,
				start: info.event.start,
				end: info.event.end,
			}
			await editEvents({ event: JSON.stringify(updatedEvent) })
			await getList()
			message.success('事件已更新')
		} catch (error) {
			console.log('事件更新失败', error)

			message.error('事件更新失败')
		}
	}

	const handleEventResize = async (info: EventResizeDoneArg) => {
		handleEventDrop(info as unknown as EventDropArg)
	}

	const handleDeleteEvent = (mode: 'single' | 'all' | 'future', occurrenceDate?: Date) => {
		if (!selectedEvent) return
		if (mode === 'all') {
			setEvents(events.filter((e) => e.id !== selectedEvent.id))
			message.success('事件已删除')
		} else if (mode === 'single' && occurrenceDate) {
			// 单次删除，加入 exdate
			const updatedEvents = events.map((e) => {
				if (e.id === selectedEvent.id) {
					const exdate = Array.isArray(e.exdate) ? [...e.exdate] : e.exdate ? [e.exdate] : []
					return {
						...e,
						exdate: [...exdate, dayjs(occurrenceDate).toISOString()],
					}
				}
				return e
			})
			setEvents(updatedEvents)
			message.success('本次已删除')
		} else if (mode === 'future' && occurrenceDate) {
			// 本次及后续，调整 rrule.until
			const updatedEvents = events.map((e) => {
				if (e.id === selectedEvent.id && typeof e.rrule === 'object' && e.rrule !== null) {
					const rruleObj = { ...e.rrule } as Record<string, any>
					rruleObj.until = dayjs(occurrenceDate).subtract(1, 'day').toISOString()
					return {
						...e,
						rrule: rruleObj,
					}
				}
				return e
			})
			setEvents(updatedEvents)
			message.success('本次及后续已删除')
		}
		setIsDetailModalVisible(false)
	}

	return (
		<Card className='calendar-card'>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, rrulePlugin]}
				initialView='dayGridMonth'
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
				}}
				locale={zhCnLocale}
				editable={true}
				selectable={true}
				selectMirror={true}
				dayMaxEvents={true}
				weekends={true}
				events={events}
				select={handleDateSelect}
				eventClick={handleEventClick}
				eventDrop={handleEventDrop}
				eventResize={handleEventResize}
				eventDidMount={handleEventDidMount}
				height='auto'
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					meridiem: false,
					hour12: false,
				}}
				eventResizableFromStart={true}
				eventMinHeight={20}
				eventMinWidth={20}
				allDaySlot={true}
				slotMinTime='00:00'
				slotMaxTime='24:00'
				slotDuration='00:30'
				slotLabelInterval='01:00'
				expandRows={true}
				stickyHeaderDates={true}
				nowIndicator={true}
				eventStartEditable={true}
				eventDurationEditable={true}
			/>

			<EventModal
				open={isModalVisible}
				isEditMode={isEditMode}
				form={form}
				eventRepeatOptions={eventRepeatOptions}
				selectedEvent={selectedEvent}
				onCancel={() => {
					setIsModalVisible(false)
					form.resetFields()
				}}
			/>

			<DetailModal
				event={selectedEvent}
				eventRepeatOptions={eventRepeatOptions}
				open={isDetailModalVisible}
				onEdit={handleDetailEdit}
				onCancel={() => setIsDetailModalVisible(false)}
				occurrenceDate={selectedOccurrenceDate}
				onDelete={handleDeleteEvent}
			/>
		</Card>
	)
}

export default Calendar
