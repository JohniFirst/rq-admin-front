import type { EChartsOption } from 'echarts'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsColors } from '@/enums/echartsColors'

// 注册 echarts 核心组件（只需注册一次）
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
])

// 导出 echarts 核心供其他组件使用
export { echarts, echartsColors }

// 导出类型
export type { EChartsOption }

// 创建图表实例的工厂函数
export function createChartInstance(dom: HTMLElement | null) {
  return echarts.init(dom)
}

// 销毁图表实例
export function disposeChartInstance(chart: echarts.ECharts | undefined) {
  if (chart) {
    chart.dispose()
  }
}
