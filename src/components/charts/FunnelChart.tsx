import React from 'react';
import ReactECharts from 'echarts-for-react';

interface FunnelData {
  stage: string;
  value: number;
  conversionRate: number;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
  height?: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title, height = 350 }) => {
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
        const item = data.find((d) => d.stage === params.name);
        return `<div style="padding: 4px 0;">
          <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
          <div>人数: <span style="color: ${params.color}; font-weight: 600;">${params.value}</span> 人</div>
          <div>占比: <span style="font-weight: 600;">${params.percent}%</span></div>
          ${item && item.conversionRate < 100 ? `<div>环节转化率: <span style="color: #00B42A; font-weight: 600;">${item.conversionRate}%</span></div>` : ''}
        </div>`;
      },
    },
    legend: {
      data: data.map((d) => d.stage),
      textStyle: {
        color: '#94A3B8',
        fontSize: 11,
      },
      bottom: 0,
      itemGap: 10,
    },
    series: [
      {
        name: '转化漏斗',
        type: 'funnel',
        left: '10%',
        right: '10%',
        top: 40,
        bottom: 60,
        minSize: '20%',
        maxSize: '100%',
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const item = data.find((d) => d.stage === params.name);
            return `{a|${params.name}}\n{b|${params.value}人} {c|${item?.conversionRate || 100}%}`;
          },
          rich: {
            a: {
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 20,
            },
            b: {
              color: 'rgba(255,255,255,0.9)',
              fontSize: 11,
            },
            c: {
              color: '#00B42A',
              fontSize: 11,
              fontWeight: 600,
            },
          },
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0F172A',
          borderWidth: 2,
        },
        emphasis: {
          label: {
            fontSize: 14,
          },
          itemStyle: {
            shadowColor: 'rgba(22, 93, 255, 0.5)',
            shadowBlur: 20,
          },
        },
        data: data.map((d, i) => ({
          value: d.value,
          name: d.stage,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: colors[i % colors.length] },
                { offset: 1, color: `${colors[i % colors.length]}80` },
              ],
            },
          },
        })),
        animationDuration: 1500,
        animationEasing: 'elasticOut',
        animationDelay: (idx: number) => idx * 200,
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

export default FunnelChart;
