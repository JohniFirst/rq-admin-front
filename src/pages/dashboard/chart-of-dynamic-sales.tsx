import { useEffect, useRef, useState } from 'react'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入折线图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

interface SalesData {
  time: string
  amount: number
}

/**
 * Renders a dynamic sorting line chart component showing the changes in sales amount over time.
 *
 * @return {JSX.Element} The rendered line chart component.
 */
function ChartOfDynamicSales(): JSX.Element {
  const chartRef = useRef(null)
  const [salesData, setSalesData] = useState<SalesData[]>([
    { time: '08:00', amount: 500 },
    { time: '09:00', amount: 800 },
    { time: '10:00', amount: 600 },
    { time: '11:00', amount: 900 },
    { time: '12:00', amount: 1200 }
  ])

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = echarts.init(chartRef.current)

    const sortData = () => {
      setSalesData((prevData) => {
        const sortedData = [...prevData].sort((a, b) => b.amount - a.amount)
        return sortedData
      })
    }

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '销售额变化（动态排序）'
      },
      xAxis: {
        type: 'category',
        data: salesData.map((item) => item.time)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: salesData.map((item) => item.amount),
          type: 'line'
        }
      ],
      tooltip: {
        trigger: 'axis'
      }
    }

    // 使用配置项显示图表
    myChart.setOption(option)

    // 模拟数据动态变化（例如每隔一段时间更新销售额数据，并排序）
    const interval = setInterval(() => {
      const newData = {
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        amount: Math.random() * 1500
      }
      setSalesData((prevData) => {
        const updatedData = [...prevData, newData]
        if (updatedData.length > 30) {
          updatedData.shift()
        }
        sortData()
        return updatedData
      })
    }, 5000)

    // 组件卸载时销毁图表和定时器
    return () => {
      myChart.dispose()
      clearInterval(interval)
    }
  }, [salesData])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
}

export default ChartOfDynamicSales
