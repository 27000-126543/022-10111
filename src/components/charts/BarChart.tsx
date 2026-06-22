import React from 'react';
import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  xData: string[];
  yData: { name: string; data: number[]; color: string }[];
  title?: string;
  height?: number;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  xData,
  yData,
  title,
  height = 300,
  horizontal = false,
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
      trigger: horizontal ? 'axis' : 'axis',
      axisPointer: {
        type: horizontal ? 'shadow' : 'shadow',
      },
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#CBD5E1',
      },
    },
    legend: {
      data: yData.map((d) => d.name),
      textStyle: {
        color: '#94A3B8',
      },
      top: 0,
      right: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 40,
      containLabel: true,
    },
    xAxis: horizontal
      ? {
          type: 'value',
          axisLine: {
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
        }
      : {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: 'rgba(71, 85, 105, 0.5)',
            },
          },
          axisLabel: {
            color: '#94A3B8',
            fontSize: 11,
            interval: 0,
            rotate: xData.length > 6 ? 30 : 0,
          },
          axisTick: {
            show: false,
          },
        },
    yAxis: horizontal
      ? {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: 'rgba(71, 85, 105, 0.5)',
            },
          },
          axisLabel: {
            color: '#94A3B8',
          },
          axisTick: {
            show: false,
          },
        }
      : {
          type: 'value',
          axisLine: {
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
    series: yData.map((d, index) => ({
      name: d.name,
      type: 'bar',
      barWidth: horizontal ? '50%' : '40%',
      data: d.data,
      itemStyle: {
        color: {
          type: horizontal ? 'linear' : 'linear',
          x: 0,
          y: 0,
          x2: horizontal ? 1 : 0,
          y2: horizontal ? 0 : 1,
          colorStops: [
            { offset: 0, color: d.color },
            { offset: 1, color: `${d.color}80` },
          ],
        },
        borderRadius: horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowColor: d.color,
          shadowBlur: 20,
        },
      },
      animationDelay: (idx: number) => idx * 100 + index * 200,
    })),
    animationDuration: 1500,
    animationEasing: 'elasticOut',
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default BarChart;
