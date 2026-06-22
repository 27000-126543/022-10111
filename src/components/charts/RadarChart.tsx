import React from 'react';
import ReactECharts from 'echarts-for-react';

interface RadarData {
  name: string;
  value: number;
}

interface RadarChartProps {
  data: RadarData[];
  title?: string;
  height?: number;
  max?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, title, height = 300, max = 100 }) => {
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
          left: 'center',
          top: 10,
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#CBD5E1',
      },
    },
    radar: {
      indicator: data.map((d) => ({
        name: d.name,
        max: max,
        axisName: {
          color: '#94A3B8',
          fontSize: 11,
        },
      })),
      center: ['50%', '55%'],
      radius: '60%',
      splitNumber: 4,
      axisName: {
        color: '#94A3B8',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(22, 93, 255, 0.02)', 'rgba(22, 93, 255, 0.05)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
      },
    },
    series: [
      {
        name: '项目热度指数',
        type: 'radar',
        data: [
          {
            value: data.map((d) => d.value),
            name: '热度指数',
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 2,
              color: '#165DFF',
              shadowColor: '#165DFF',
              shadowBlur: 10,
            },
            itemStyle: {
              color: '#165DFF',
              borderColor: '#0F172A',
              borderWidth: 2,
            },
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  { offset: 0, color: 'rgba(22, 93, 255, 0.6)' },
                  { offset: 1, color: 'rgba(22, 93, 255, 0.1)' },
                ],
              },
            },
          },
        ],
        animationDuration: 2000,
        animationEasing: 'elasticOut',
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default RadarChart;
