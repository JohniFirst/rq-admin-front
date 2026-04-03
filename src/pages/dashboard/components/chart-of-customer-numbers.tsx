import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

/**
 * Renders a bar chart component showing the number of old and new customers within the same period.
 * The old customers are displayed on the top part and the new customers on the bottom part of each bar.
 *
 * @return {JSX.Element} The rendered bar chart component.
 */
function ChartOfCustomerNumbers() {
  const chartRef = useRef(null)

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = createChartInstance(chartRef.current)

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
      disposeChartInstance(myChart)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfCustomerNumbers
