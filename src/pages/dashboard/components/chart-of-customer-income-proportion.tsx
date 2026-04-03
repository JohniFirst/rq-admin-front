import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

/**
 * Renders a pie chart component showing the proportion of customer incomes.
 *
 * @return {JSX.Element} The rendered pie chart component.
 */
function ChartOfCustomerIncomeProportion() {
  const chartRef = useRef(null)

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = createChartInstance(chartRef.current)

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

    // 使用配置项显示图表
    myChart.setOption(option)

    // 组件卸载时销毁图表
    return () => {
      disposeChartInstance(myChart)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
}

export default ChartOfCustomerIncomeProportion
