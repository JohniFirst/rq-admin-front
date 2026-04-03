import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

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
  const chartInstanceRef = useRef<ReturnType<typeof createChartInstance> | null>(null)
  const dataRef = useRef<SalesData[]>([
    { time: '08:00', amount: 500 },
    { time: '09:00', amount: 800 },
    { time: '10:00', amount: 600 },
    { time: '11:00', amount: 900 },
    { time: '12:00', amount: 1200 },
  ])

  useEffect(() => {
    // 初始化图表实例
    const myChart = createChartInstance(chartRef.current)
    chartInstanceRef.current = myChart

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: '销售额变化（动态排序）',
      },
      color: echartsColors,
      xAxis: {
        type: 'category',
        data: dataRef.current.map(item => item.time),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: dataRef.current.map(item => item.amount),
          type: 'line',
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
    }

    myChart.setOption(option)

    // 模拟数据动态变化
    const interval = setInterval(() => {
      const newData = {
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: Math.random() * 1500,
      }

      const updatedData = [...dataRef.current, newData]
      if (updatedData.length > 30) {
        updatedData.shift()
      }

      // 排序
      updatedData.sort((a, b) => b.amount - a.amount)
      dataRef.current = updatedData

      // 更新图表数据
      myChart.setOption({
        xAxis: {
          data: updatedData.map(item => item.time),
        },
        series: [
          {
            data: updatedData.map(item => item.amount),
          },
        ],
      })
    }, 5000)

    // 组件卸载时销毁图表和定时器
    return () => {
      disposeChartInstance(chartInstanceRef.current)
      clearInterval(interval)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfDynamicSales
