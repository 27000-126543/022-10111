import React, { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { TrendingUp, TrendingDown } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import type { KpiData } from '../types';
import { formatNumber } from '../utils/format';

interface KpiCardProps {
  data: KpiData;
  delay?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ data, delay = 0 }) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const countUpRef = useRef<CountUp | null>(null);

  useEffect(() => {
    if (countRef.current && !countUpRef.current) {
      const timer = setTimeout(() => {
        countUpRef.current = new CountUp(countRef.current!, data.value, {
          duration: 2,
          separator: ',',
          decimalPlaces: data.unit === '%' ? 1 : 0,
        });
        countUpRef.current.start();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [data.value, data.unit, delay]);

  const miniChartOption = {
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: data.miniChartData.map((_, i) => i),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'line',
        data: data.miniChartData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: data.color || '#165DFF',
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
                color: `${data.color || '#165DFF'}40`,
              },
              {
                offset: 1,
                color: `${data.color || '#165DFF'}00`,
              },
            ],
          },
        },
      },
    ],
  };

  const isPositive = data.trendType === 'up';
  const isGoodTrend = 
    (data.title.includes('量') || data.title.includes('率')) && isPositive ||
    (data.title.includes('时长') || data.title.includes('次数')) && !isPositive;

  return (
    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 group overflow-hidden">
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: data.color || '#165DFF' }}
      />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-medium tracking-wide">{data.title}</h3>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isGoodTrend ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {isGoodTrend ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{formatNumber(Math.abs(data.trend), 1)}%</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span 
            ref={countRef}
            className="text-4xl font-bold tracking-tight"
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              color: data.color || '#165DFF',
            }}
          >
            0
          </span>
          <span className="text-slate-400 text-lg font-medium">{data.unit}</span>
        </div>
        <div className="w-20 h-10">
          <ReactECharts 
            option={miniChartOption} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: data.color || '#165DFF' }} />
        <span>较昨日{isGoodTrend ? '下降' : '上升'}{isPositive ? '' : ''}</span>
      </div>
    </div>
  );
};

export default KpiCard;
