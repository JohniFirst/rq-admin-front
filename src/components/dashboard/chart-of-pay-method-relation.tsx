import { Segmented } from 'antd'
import type { EChartsOption } from 'echarts'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef, useState } from 'react'
import { echartsColors } from '@/enums/echartsColors.ts'
import { useInViewport } from '@/hooks/useInViewport.ts'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

interface PayMethod {
  name: string
  value: number
}

function ChartOfPayMethodRelation() {
  const chartRef = useRef(null)
  const [timeRange, setTimeRange] = useState('每天')

  const [isInViewport] = useInViewport(chartRef)

  // 初始数据设置为每天的数据
  const [data, setData] = useState<PayMethod[]>([
    { name: '现金', value: 30 },
    { name: '微信', value: 50 },
    { name: '支付宝', value: 20 },
    { name: '云闪付', value: 10 },
    { name: '数字人民币', value: 5 },
    { name: '其它方式', value: 5 },
  ])

  useEffect(() => {
    // 根据时间范围模拟不同的数据
    if (timeRange === '每天') {
      setData([
        { name: '现金', value: 30 },
        { name: '微信', value: 50 },
        { name: '支付宝', value: 20 },
        { name: '云闪付', value: 10 },
        { name: '数字人民币', value: 5 },
        { name: '其它方式', value: 5 },
      ])
    } else if (timeRange === '每周') {
      setData([
        { name: '现金', value: 40 },
        { name: '微信', value: 40 },
        { name: '支付宝', value: 15 },
        { name: '云闪付', value: 10 },
        { name: '数字人民币', value: 8 },
        { name: '其它方式', value: 7 },
      ])
    } else if (timeRange === '每月') {
      setData([
        { name: '现金', value: 25 },
        { name: '微信', value: 55 },
        { name: '支付宝', value: 15 },
        { name: '云闪付', value: 8 },
        { name: '数字人民币', value: 5 },
        { name: '其它方式', value: 2 },
      ])
    } else if (timeRange === '每年') {
      setData([
        { name: '现金', value: 20 },
        { name: '微信', value: 60 },
        { name: '支付宝', value: 15 },
        { name: '云闪付', value: 8 },
        { name: '数字人民币', value: 5 },
        { name: '其它方式', value: 2 },
      ])
    }

    const myChart = echarts.init(chartRef.current)

    const option: EChartsOption = {
      title: {
        text: `顾客支付方式（${timeRange}）`,
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
          name: '支付方式',
          type: 'pie',
          radius: [20, 140],
          center: ['50%', '50%'],
          roseType: 'area',
          data,
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

    myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  }, [timeRange, isInViewport])

  return (
    <div>
      <Segmented<string>
        className={'mb-[12px]'}
        options={['每天', '每周', '每月', '每年']}
        onChange={value => setTimeRange(value)}
      />
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  )
}

export default ChartOfPayMethodRelation
