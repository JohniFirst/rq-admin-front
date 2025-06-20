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
import tippy from 'tippy.js'
import { editEvents, getEventsList } from '@/api/calendar'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/animations/scale.css' // optional for animations
import 'tippy.js/themes/light.css' // optional for themes
import DetailModal from './detail-modal'
import EventModal, { type EventFormData } from './event-modal'

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
	const [form] = Form.useForm<EventFormData>()
	const [_selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)
	const [isEditMode, setIsEditMode] = useState(false)

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
			const parsedEvents = res.map((item: any) => {
				const parsed = JSON.parse(item.event)

				if (!parsed.rrule?.freq) {
					delete parsed.rrule
				}

				parsed.id = item.id
				return parsed
			})
			setEvents(parsedEvents)
		} catch (e) {
			console.error('获取日历事件失败', e)
			setEvents([])
		}
	}

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedDate(selectInfo)
		form.setFieldsValue({
			startDate: dayjs(selectInfo.start),
			endDate: dayjs(selectInfo.end),
			reminder: true,
			color: '#1890ff',
		})
		setIsEditMode(false)
		setIsModalVisible(true)
	}

	const handleEventClick = (info: EventClickArg) => {
		// 这里假设 info.event.start 是 occurrence 的实际发生时间
		setSelectedEvent(Object.assign(info.event, info.event.extendedProps) as CustomEventInput)
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
				selectedEvent={selectedEvent}
				onCancel={() => {
					setIsModalVisible(false)
					form.resetFields()
				}}
			/>

			<DetailModal
				event={selectedEvent}
				open={isDetailModalVisible}
				onEdit={handleDetailEdit}
				onCancel={() => setIsDetailModalVisible(false)}
			/>
		</Card>
	)
}

export default Calendar
