import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PieData {
  name: string;
  value: number;
  conversionRate?: number;
}

interface PieChartProps {
  data: PieData[];
  title?: string;
  height?: number;
  showLabel?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, height = 300, showLabel = true }) => {
  const colors = ['#165DFF', '#00B42A', '#FF7D00', '#722ED1', '#F53F3F', '#86909C'];

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
      formatter: (params: any) => {
        const item = data.find((d) => d.name === params.name);
        return `<div style="padding: 4px 0;">
          <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
          <div>新客数: <span style="color: ${params.color}; font-weight: 600;">${params.value}</span> 人</div>
          <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>
          ${item?.conversionRate ? `<div>转化率: <span style="color: #00B42A; font-weight: 600;">${item.conversionRate}%</span></div>` : ''}
        </div>`;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#94A3B8',
        fontSize: 12,
      },
      itemGap: 12,
    },
    series: [
      {
        name: '渠道来源',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '55%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#0F172A',
          borderWidth: 3,
        },
        label: showLabel
          ? {
              show: true,
              position: 'inside',
              formatter: '{d}%',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
            }
          : { show: false },
        labelLine: {
          show: false,
        },
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          itemStyle: {
            color: colors[i % colors.length],
          },
        })),
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(22, 93, 255, 0.4)',
          },
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200,
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

export default PieChart;
