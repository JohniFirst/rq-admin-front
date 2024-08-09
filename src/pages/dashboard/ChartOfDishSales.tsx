import { useEffect, useRef, useState } from "react";
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from "echarts/charts";
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from "echarts/components";
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

interface DishSales {
  dish: string;
  sales: number;
}

/**
 * Renders a dynamic sorting bar chart for dish sales.
 *
 * @return {JSX.Element} The rendered dynamic sorting bar chart component.
 */
function ChartOfDishSales(): JSX.Element {
  const chartRef = useRef(null);
  const [dishSalesData, setDishSalesData] = useState<DishSales[]>([
    { dish: "宫保鸡丁", sales: 100 },
    { dish: "鱼香肉丝", sales: 80 },
    { dish: "麻婆豆腐", sales: 120 },
    { dish: "回锅肉", sales: 90 },
    { dish: "糖醋排骨", sales: 110 }
  ]);

  useEffect(() => {
    // 基于准备好的 dom，初始化 echarts 实例
    const myChart = echarts.init(chartRef.current);

    const run = () => {
      const updatedData = dishSalesData.map((item) => {
        if (Math.random() > 0.9) {
          return {...item, sales: item.sales + Math.round(Math.random() * 500) };
        } else {
          return {...item, sales: item.sales + Math.round(Math.random() * 50) };
        }
      });

      setDishSalesData(updatedData);

      // 确保更新选项时图表存在
      if (myChart) {
        myChart.setOption({
          series: [
            {
              type: "bar",
              data: updatedData.sort((a, b) => b.sales - a.sales),
              realtimeSort: true
            }
          ],
          yAxis: {
            type: "category",
            data: updatedData.sort((a, b) => b.sales - a.sales).map(item => item.dish),
            inverse: true
          },
          xAxis: {
            type: "value",
            max: Math.max(...updatedData.map(item => item.sales))
          }
        });
      }
    };

    // 初始配置选项
    const option: EChartsOption = {
      title: {
        text: "菜品销售动态排序柱状图"
      },
      series: [
        {
          type: "bar",
          data: dishSalesData.sort((a, b) => b.sales - a.sales).map(item => item.sales),
          realtimeSort: true,
          label: {
            show: true,
            position: "right"
          }
        }
      ],
      yAxis: {
        type: "category",
        data: dishSalesData.sort((a, b) => b.sales - a.sales).map(item => item.dish),
        inverse: true
      },
      xAxis: {
        type: "value",
        max: Math.max(...dishSalesData.map(item => item.sales))
      },
      legend: {
        show: true
      },
      animationDuration: 0,
      animationDurationUpdate: 3000
    };

    myChart.setOption(option);

    // 立即执行一次
    run();

    // 定时执行
    const interval = setInterval(run, 3000);

    // 组件卸载时销毁图表和定时器
    return () => {
      if (myChart) {
        myChart.dispose();
      }
      clearInterval(interval);
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
}

export default ChartOfDishSales;
