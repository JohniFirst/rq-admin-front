import type { EChartsOption } from 'echarts'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'
import { echartsColors } from '@/enums/echartsColors.ts'
import { useInViewport } from '@/hooks/useInViewport.ts'

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
  LegendComponent,
])

/**
 * Renders a bar chart component showing the number of old and new customers within the same period.
 * The old customers are displayed on the top part and the new customers on the bottom part of each bar.
 *
 * @return {JSX.Element} The rendered bar chart component.
 */
function ChartOfCustomerNumbers() {
  const chartRef = useRef(null)

  const [isInViewport] = useInViewport(chartRef)

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = echarts.init(chartRef.current)

    // 准备数据
    const data = [
      { period: '每天', oldCustomers: 200, newCustomers: 300 },
      { period: '每周', oldCustomers: 300, newCustomers: 500 },
      { period: '每月', oldCustomers: 400, newCustomers: 800 },
    ]

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '不同周期顾客人数',
      },
      color: echartsColors,
      xAxis: {
        type: 'category',
        data: data.map(item => item.period),
      },
      yAxis: {
        type: 'value',
        name: '人数',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: '老顾客',
          stack: 'total',
          data: data.map(item => item.oldCustomers),
          type: 'bar',
        },
        {
          name: '新顾客',
          stack: 'total',
          data: data.map(item => item.newCustomers),
          type: 'bar',
        },
      ],
    }

    // 使用配置项显示图表
    myChart.setOption(option)

    // 组件卸载时销毁图表
    return () => {
      myChart.dispose()
    }
  }, [isInViewport])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfCustomerNumbers
