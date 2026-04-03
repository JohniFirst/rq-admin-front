import type { EChartsOption } from 'echarts'
import { useEffect, useRef } from 'react'
import { createChartInstance, disposeChartInstance, echartsColors } from '@/config/echarts'

/**
 * Renders a pie chart displaying the proportion of guests from different sources.
 *
 * Represents the data of guest source.
 *
 * @return {JSX.Element} A div element containing the pie chart.
 */
function ChartOfGuestSourcePie() {
  const chartRef = useRef(null)

  useEffect(() => {
    const myChart = createChartInstance(chartRef.current)

    const data = [
      { name: '自然进店', value: 40 },
      { name: '朋友推荐', value: 30 },
      { name: '抖音视频', value: 20 },
      { name: '小红书广告', value: 10 },
    ]

    const option: EChartsOption = {
      title: {
        text: '客人来源占比',
      },
      color: echartsColors,
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 'bottom',
        align: 'right',
      },
      series: [
        {
          name: '客人来源',
          type: 'pie',
          radius: ['40%', '70%'],
          padAngle: 5,
          data,
          label: {
            // show: false,
            // position: 'center'
          },
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
      disposeChartInstance(myChart)
    }
  }, [])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}

export default ChartOfGuestSourcePie
