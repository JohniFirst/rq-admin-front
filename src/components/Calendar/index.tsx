import type { DateSelectArg, EventClickArg, EventDropArg, EventInput, EventMountArg } from '@fullcalendar/core'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type EventResizeDoneArg } from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Card, Modal, message } from 'antd'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect, useState } from 'react'
import './calendar.css'
import tippy from 'tippy.js'
import { type CalendarListParams, editEvents, getEventsList } from '@/api/calendar'
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
	const [isEditMode, setIsEditMode] = useState(false)
	const [start, setStart] = useState<string>('') // 当前日历的开始时间
	const [end, setEnd] = useState<string>('') // 当前日历的结束时间

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

	// getList 直接用 CalendarListParams 作为参数
	const getList = async (params: CalendarListParams) => {
		try {
			const res = await getEventsList(params)
			const parsedEvents = res.map((item: any) => {
				const parsed = JSON.parse(item.event)

				if (!parsed.rrule?.freq) {
					delete parsed.rrule
				}

				parsed.id = item.id
				return parsed
			})

			console.log('获取到的日历事件', parsedEvents)
			setEvents(parsedEvents)
		} catch (e) {
			console.error('获取日历事件失败', e)
			setEvents([])
		}
	}

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedEvent(selectInfo)

		setIsEditMode(false)
		setIsModalVisible(true)
	}

	const handleEventClick = (info: EventClickArg) => {
		setSelectedEvent(Object.assign(info.event, info.event.extendedProps) as CustomEventInput)
		setIsDetailModalVisible(true)
	}

	const handleDetailEdit = () => {
		if (selectedEvent) {
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

			await getList({ start, end })

			message.success('事件已更新')
		} catch (error) {
			console.log('事件更新失败', error)
			message.error('事件更新失败')
		}
	}

	const handleEventResize = (info: EventResizeDoneArg) => {
		handleEventDrop(info as unknown as EventDropArg)
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
				weekends={true}
				events={events}
				select={handleDateSelect}
				eventClick={handleEventClick}
				eventDrop={handleEventDrop}
				eventResize={handleEventResize}
				eventDidMount={handleEventDidMount}
				height={700}
				eventResizableFromStart={true}
				allDaySlot={true}
				expandRows={true}
				nowIndicator={true}
				eventStartEditable={true}
				eventDurationEditable={true}
				datesSet={(arg) => {
					const { start, end } = arg
					setStart(start.toISOString())
					setEnd(end.toISOString())
					getList({ start: start.toISOString(), end: end.toISOString() })
				}}
			/>

			<EventModal
				open={isModalVisible}
				isEditMode={isEditMode}
				selectedEvent={selectedEvent}
				onCancel={() => {
					getList({ start, end })
					setIsModalVisible(false)
				}}
				onSuccess={() => {
					getList({ start, end })
				}}
			/>

			<DetailModal
				event={selectedEvent}
				open={isDetailModalVisible}
				onEdit={handleDetailEdit}
				onCancel={() => {
					// getList({ start, end })
					setIsDetailModalVisible(false)
				}}
			/>
		</Card>
	)
}

export default Calendar
