import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

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

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = createChartInstance(chartRef.current)

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
      { time: '18:00', people: 105 },
    ]

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '客流量',
      },
      color: [echartsColors[0]],
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.time),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.map(item => item.people),
          type: 'bar',
        },
      ],
    }

    // 使用配置项显示图表
    myChart.setOption(option)

    // 组件卸载时销毁图表
    return () => {
      disposeChartInstance(myChart)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfInStorePeople
