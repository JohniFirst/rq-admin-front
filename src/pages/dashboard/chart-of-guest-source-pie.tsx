import { useEffect, useRef } from 'react'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { echartsColors } from '@/enums/echartsColors'
import { useInViewport } from '@/hooks/useInViewport'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

/**
 * Renders a pie chart displaying the proportion of guests from different sources.
 *
 * Represents the data of guest source.
 *
 * @return {JSX.Element} A div element containing the pie chart.
 */
function ChartOfGuestSourcePie() {
  const chartRef = useRef(null)

  const [isInViewport] = useInViewport(chartRef)

  useEffect(() => {
    const myChart = echarts.init(chartRef.current)

    const data = [
      { name: '自然进店', value: 40 },
      { name: '朋友推荐', value: 30 },
      { name: '抖音视频', value: 20 },
      { name: '小红书广告', value: 10 }
    ]

    const option: EChartsOption = {
      title: {
        text: '客人来源占比'
      },
      color: echartsColors,
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: 'bottom',
        align: 'right'
      },
      series: [
        {
          name: '客人来源',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [isInViewport])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
}

export default ChartOfGuestSourcePie
