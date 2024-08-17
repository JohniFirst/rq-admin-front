import { useEffect, useRef } from 'react'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入饼图图表，图表后缀都为 Chart
import { PieChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { echartsColors } from '@/enums/echartsColors.ts'
import { useInViewport } from '@/hooks/useInViewport.ts'

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
  CanvasRenderer,
  LegendComponent,
])

/**
 * Renders a pie chart component showing the proportion of customer incomes.
 *
 * @return {JSX.Element} The rendered pie chart component.
 */
function ChartOfCustomerIncomeProportion() {
  const chartRef = useRef(null)

  const [isInViewport] = useInViewport(chartRef)

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = echarts.init(chartRef.current)

    // 准备数据
    const data = [
      { name: '低收入', value: 30 },
      { name: '中等收入', value: 50 },
      { name: '高收入', value: 20 },
    ]

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '顾客收入占比',
      },
      color: echartsColors,
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 'bottom',
      },
      series: [
        {
          name: '收入占比',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
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

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
}

export default ChartOfCustomerIncomeProportion
