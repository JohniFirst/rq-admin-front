import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
]);

/**
 * Renders a component showing the relationship between order amount and order count.
 *
 * @return {JSX.Element} The rendered component.
 */
function ChartOfOrderRelation() {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    // 准备数据
    const data = [
      { date: "01/01", amount: 5000, count: 80 },
      { date: "02/01", amount: 6000, count: 90 },
      { date: "03/01", amount: 4500, count: 70 },
      { date: "04/01", amount: 7000, count: 110 },
      { date: "05/01", amount: 5500, count: 85 },
      { date: "06/01", amount: 6500, count: 95 },
      { date: "07/01", amount: 5000, count: 75 },
      { date: "08/01", amount: 7500, count: 105 },
      { date: "09/01", amount: 6000, count: 90 },
      { date: "10/01", amount: 8000, count: 120 },
    ];

    // 配置选项
    const option: EChartsOption = {
      title: {
        text: "订单金额与订单数关系",
      },
      tooltip: {
        trigger: "axis",
      },
      color: ["#FF4500", "#FF007F"],
      legend: {
        data: ["订单金额", "订单数"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: data.map((item) => item.date),
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "订单金额",
        },
        {
          type: "value",
          name: "订单数",
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],
      series: [
        {
          name: "订单金额",
          type: "bar",
          data: data.map((item) => item.amount),
          yAxisIndex: 0,
        },
        {
          name: "订单数",
          type: "line",
          data: data.map((item) => item.count),
          yAxisIndex: 1,
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
}

export default ChartOfOrderRelation;
