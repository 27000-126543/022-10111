import React from 'react';
import ReactECharts from 'echarts-for-react';

interface HeatmapData {
  hour: string;
  day: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
  height?: number;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title, height = 300 }) => {
  const hours = Array.from(new Set(data.map((d) => d.hour))).sort();
  const days = Array.from(new Set(data.map((d) => d.day)));
  
  const maxValue = Math.max(...data.map((d) => d.value));
  
  const heatmapData = days.flatMap((day) =>
    hours.map((hour) => {
      const item = data.find((d) => d.day === day && d.hour === hour);
      return [hours.indexOf(hour), days.indexOf(day), item?.value || 0];
    })
  );

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
      position: 'top',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(71, 85, 105, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#CBD5E1',
      },
      formatter: (params: any) => {
        const day = days[params.value[1]];
        const hour = hours[params.value[0]];
        const value = params.value[2];
        return `<div style="padding: 4px 0;">
          <div style="font-weight: 600; margin-bottom: 4px;">${day} ${hour}:00-${parseInt(hour) + 1}:00</div>
          <div>接诊量: <span style="color: #165DFF; font-weight: 600;">${value}</span> 人</div>
        </div>`;
      },
    },
    grid: {
      left: '8%',
      right: '12%',
      bottom: '10%',
      top: title ? 40 : 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: hours.map((h) => `${h}:00`),
      splitArea: {
        show: true,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(71, 85, 105, 0.5)',
        },
      },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10,
        interval: 2,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true,
      },
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
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'vertical',
      right: '2%',
      top: 'center',
      textStyle: {
        color: '#94A3B8',
        fontSize: 10,
      },
      inRange: {
        color: ['#0F172A', '#1E3A5F', '#165DFF', '#3B82F6', '#60A5FA', '#93C5FD'],
      },
    },
    series: [
      {
        name: '接诊量',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          color: '#fff',
          fontSize: 10,
          formatter: (params: any) => params.value[2] || '',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(22, 93, 255, 0.5)',
          },
        },
        animationDuration: 1500,
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

export default HeatmapChart;
