import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

import { echartsColors } from '@/enums/echartsColors.ts'
import type { EChartsOption } from 'echarts'

echarts.use([GridComponent, LegendComponent, BarChart, CanvasRenderer])

/**
 * Renders a dynamic sorting bar chart for dish sales.
 *
 * @return {JSX.Element} The rendered dynamic sorting bar chart component.
 */
function ChartOfDishSales(): JSX.Element {
	const chartRef = useRef(null)

	const data: number[] = []
	for (let i = 0; i < 5; ++i) {
		data.push(Math.round(Math.random() * 200))
	}

	useEffect(() => {
		// 基于准备好的 dom，初始化 echarts 实例
		const myChart = echarts.init(chartRef.current)

		// 初始配置选项
		const option: EChartsOption = {
			title: {
				text: '菜品销售数据',
			},
			xAxis: {
				max: 'dataMax',
			},
			yAxis: {
				type: 'category',
				data: ['宫保鸡丁', '鱼香肉丝', '麻婆豆腐', '回锅肉', '糖醋排骨'],
				inverse: true,
				animationDuration: 300,
				animationDurationUpdate: 300,
			},
			color: echartsColors,
			tooltip: {
				trigger: 'axis',
			},
			series: [
				{
					realtimeSort: true,
					name: '销量/份',
					type: 'bar',
					data: data,
					label: {
						show: true,
						position: 'right',
						valueAnimation: true,
					},
				},
			],
			legend: {
				show: true,
			},
			animationDuration: 0,
			animationDurationUpdate: 3000,
			animationEasing: 'linear',
			animationEasingUpdate: 'linear',
		}

		myChart.setOption(option)
		function run() {
			for (let i = 0; i < data.length; ++i) {
				if (Math.random() > 0.9) {
					data[i] += Math.round(Math.random() * 2000)
				} else {
					data[i] += Math.round(Math.random() * 200)
				}
			}
			myChart.setOption({
				series: [
					{
						type: 'bar',
						data,
					},
				],
			})
		}

		run()

		const interval = setInterval(() => {
			run()
		}, 3000)

		// 组件卸载时销毁图表和定时器
		return () => {
			if (myChart) {
				myChart.dispose()
			}
			clearInterval(interval)
		}
	}, [])

	return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfDishSales
