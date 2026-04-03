import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

/**
 * Renders a component showing the relationship among average dining time, store entry time, and the number of customers entering the store within a time period.
 *
 * @return {JSX.Element} The rendered component.
 */
function ChartOfDiningAndEntryTimeRelation() {
  const chartRef = useRef(null)

  useEffect(() => {
    const myChart = createChartInstance(chartRef.current)

    // 准备数据
    const data = [
      { entryTime: '12:00', averageDiningTime: 1.5, customerCount: 20 },
      { entryTime: '13:00', averageDiningTime: 2, customerCount: 30 },
      { entryTime: '14:00', averageDiningTime: 1.8, customerCount: 25 },
      { entryTime: '15:00', averageDiningTime: 2.2, customerCount: 35 },
      { entryTime: '16:00', averageDiningTime: 1.7, customerCount: 28 },
    ]

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '复杂关系图表',
      },
      color: echartsColors,
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['平均用餐时间', '进店人数'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.entryTime),
      },
      yAxis: [
        {
          type: 'value',
          name: '平均用餐时间（小时）',
        },
        {
          type: 'value',
          name: '进店人数',
        },
      ],
      series: [
        {
          name: '平均用餐时间',
          type: 'line',
          yAxisIndex: 0,
          data: data.map(item => item.averageDiningTime),
        },
        {
          name: '进店人数',
          type: 'bar',
          yAxisIndex: 1,
          data: data.map(item => item.customerCount),
        },
      ],
    }

    myChart.setOption(option)

    return () => {
      disposeChartInstance(myChart)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfDiningAndEntryTimeRelation
