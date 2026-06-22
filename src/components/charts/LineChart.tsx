import React from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  xData: string[];
  yData: { name: string; data: number[]; color: string; yAxisIndex?: number }[];
  showLegend?: boolean;
  title?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  xData,
  yData,
  showLegend = true,
  title,
  height = 300,
}) => {
  const option = {
    backgroundColor: 'transparent',
    title: title
      ? {
          text: title,
          textStyle: {
            color: '#CBD5E1',
            fontSize: 14,
            fontWeight: 500,
          },
          left: 10,
          top: 0,
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#CBD5E1',
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: 'rgba(59, 130, 246, 0.3)',
        },
      },
    },
    legend: showLegend
      ? {
          data: yData.map((d) => d.name),
          textStyle: {
            color: '#94A3B8',
          },
          top: 0,
          right: 10,
        }
      : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: title || showLegend ? 40 : 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.5)',
        },
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 11,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: yData.some((d) => d.yAxisIndex !== undefined)
      ? [
          {
            type: 'value',
            name: '人数',
            nameTextStyle: {
              color: '#94A3B8',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(71, 85, 105, 0.5)',
              },
            },
            axisLabel: {
              color: '#94A3B8',
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(71, 85, 105, 0.2)',
                type: 'dashed',
              },
            },
          },
          {
            type: 'value',
            name: '转化率(%)',
            nameTextStyle: {
              color: '#94A3B8',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(71, 85, 105, 0.5)',
              },
            },
            axisLabel: {
              color: '#94A3B8',
              formatter: '{value}%',
            },
            splitLine: {
              show: false,
            },
          },
        ]
      : {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(71, 85, 105, 0.5)',
            },
          },
          axisLabel: {
            color: '#94A3B8',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(71, 85, 105, 0.2)',
              type: 'dashed',
            },
          },
        },
    series: yData.map((d) => ({
      name: d.name,
      type: 'line',
      yAxisIndex: d.yAxisIndex,
      data: d.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: d.color,
        shadowColor: d.color,
        shadowBlur: 10,
        shadowOffsetY: 5,
      },
      itemStyle: {
        color: d.color,
        borderWidth: 2,
        borderColor: '#0F172A',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: `${d.color}30`,
            },
            {
              offset: 1,
              color: `${d.color}00`,
            },
          ],
        },
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowColor: d.color,
          shadowBlur: 20,
        },
      },
    })),
    animationDuration: 2000,
    animationEasing: 'cubicOut',
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default LineChart;
