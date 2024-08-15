import { useEffect, useRef } from 'react'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
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
import { useInViewport } from '@/hooks/useInViewport'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

/**
 * Renders a bar chart component using ECharts library.
 *
 * Just import the components needed.
 *
 * Represents the data of when people git in store.
 *
 * @return {JSX.Element} The rendered bar chart component.
 */
function ChartOfInStorePeople(): JSX.Element {
  const chartRef = useRef(null)

  const [isInViewport] = useInViewport(chartRef)

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = echarts.init(chartRef.current)

    // 准备数据
    const data = [
      { time: '08:00', people: 50 },
      { time: '09:00', people: 80 },
      { time: '10:00', people: 60 },
      { time: '11:00', people: 90 },
      { time: '12:00', people: 120 },
      { time: '13:00', people: 100 },
      { time: '14:00', people: 70 },
      { time: '15:00', people: 110 },
      { time: '16:00', people: 95 },
      { time: '17:00', people: 130 },
      { time: '18:00', people: 105 }
    ]

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '客流量'
      },
      color: ['#FF4500'],
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.time)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.map((item) => item.people),
          type: 'bar'
        }
      ]
    }

    // 使用配置项显示图表
    myChart.setOption(option)

    // 组件卸载时销毁图表
    return () => {
      myChart.dispose()
    }
  }, [isInViewport])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
}

export default ChartOfInStorePeople
