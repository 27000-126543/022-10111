import React, { useMemo } from 'react';
import { Select } from 'antd';
import {
  Flame,
  Filter,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { projectIntents, radarIndicators } from '../mock/projects';
import { useDataStore } from '../store/useDataStore';
import { ProjectCategoryLabels, ProjectCategory } from '../types';
import RadarChart from '../components/charts/RadarChart';
import FunnelChart from '../components/charts/FunnelChart';
import BarChart from '../components/charts/BarChart';
import { formatCurrency, formatPercent } from '../utils/format';

const ProjectHot: React.FC = () => {
  const { selectedProjectCategory, setSelectedProjectCategory, getFunnelDataByCategory } = useDataStore();

  const funnelData = useMemo(() => getFunnelDataByCategory(), [selectedProjectCategory, getFunnelDataByCategory]);

  const filteredProjectIntents = useMemo(() => {
    if (selectedProjectCategory === 'all') return projectIntents;
    return projectIntents.filter((p) => p.category === selectedProjectCategory);
  }, [selectedProjectCategory]);

  const categoryOptions = useMemo(
    () =>
      Object.entries(ProjectCategoryLabels).map(([value, label]) => ({
        value: value as ProjectCategory,
        label,
      })),
    []
  );

  const getConversionRateColor = (rate: number): string => {
    if (rate > 50) return 'bg-emerald-500';
    if (rate > 30) return 'bg-blue-500';
    return 'bg-slate-500';
  };

  const getConversionRateBg = (rate: number): string => {
    if (rate > 50) return 'bg-emerald-500/20';
    if (rate > 30) return 'bg-blue-500/20';
    return 'bg-slate-500/20';
  };

  const barChartData = useMemo(
    () => ({
      xData: filteredProjectIntents.map((p) => p.name),
      yData: [
        {
          name: '意向数',
          data: filteredProjectIntents.map((p) => p.intentCount),
          color: '#722ED1',
        },
      ],
    }),
    [filteredProjectIntents]
  );

  const totalStats = useMemo(
    () => ({
      totalIntent: filteredProjectIntents.reduce((sum, p) => sum + p.intentCount, 0),
      avgConversion: filteredProjectIntents.length > 0
        ? filteredProjectIntents.reduce((sum, p) => sum + p.conversionRate, 0) / filteredProjectIntents.length
        : 0,
      avgPrice: filteredProjectIntents.length > 0
        ? filteredProjectIntents.reduce((sum, p) => sum + p.avgPrice, 0) / filteredProjectIntents.length
        : 0,
    }),
    [filteredProjectIntents]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="text-[#E8A87C]" size={24} />
            项目意向分布与成交路径分析
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            深度分析各项目类型的意向热度、转化漏斗与成交表现
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Filter size={16} />
            <span>项目分类:</span>
          </div>
          <Select
            value={selectedProjectCategory}
            onChange={setSelectedProjectCategory}
            options={categoryOptions}
            className="w-48"
            size="middle"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
            }}
            popupClassName="!bg-slate-800 !border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#722ED1]/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#722ED1]/20 flex items-center justify-center">
                  <Users className="text-[#722ED1]" size={20} />
                </div>
                <span className="text-slate-400 text-sm">总意向数</span>
              </div>
              <Activity className="text-slate-500 group-hover:text-[#722ED1] transition-colors" size={18} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {totalStats.totalIntent}
              </span>
              <span className="text-slate-500 text-sm ml-2">人</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Target className="text-emerald-400" size={20} />
                </div>
                <span className="text-slate-400 text-sm">平均转化率</span>
              </div>
              <TrendingUp className="text-slate-500 group-hover:text-emerald-400 transition-colors" size={18} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {totalStats.avgConversion.toFixed(1)}
              </span>
              <span className="text-emerald-400 text-sm ml-2">%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8A87C]/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#E8A87C]/20 flex items-center justify-center">
                  <DollarSign className="text-[#E8A87C]" size={20} />
                </div>
                <span className="text-slate-400 text-sm">平均客单价</span>
              </div>
              <BarChart3 className="text-slate-500 group-hover:text-[#E8A87C] transition-colors" size={18} />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {formatCurrency(totalStats.avgPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Target size={18} className="text-[#722ED1]" />
              项目意向雷达图
            </h3>
            <span className="text-xs text-slate-400">6大项目类型意向分布</span>
          </div>
          <RadarChart data={radarIndicators} height={320} />
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-[#E8A87C]" />
              成交转化漏斗
            </h3>
            <span className="text-xs text-slate-400">
              当前: {ProjectCategoryLabels[selectedProjectCategory]}
            </span>
          </div>
          <FunnelChart data={funnelData} height={320} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-[#722ED1]" />
            项目意向分布
          </h3>
          <span className="text-xs text-slate-400">各项目意向数对比</span>
        </div>
        <BarChart
          xData={barChartData.xData}
          yData={barChartData.yData}
          height={280}
        />
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Flame size={18} className="text-[#E8A87C]" />
            项目意向详细列表
          </h3>
          <span className="text-xs text-slate-400">共 {filteredProjectIntents.length} 个项目</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjectIntents.map((project, index) => (
            <div
              key={project.name}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#722ED1] via-[#E8A87C] to-[#722ED1] rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700/50 group-hover:border-transparent transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${index % 2 === 0 ? '#722ED1' : '#E8A87C'}, ${index % 2 === 0 ? '#E8A87C' : '#722ED1'})`,
                      }}
                    >
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <span className="text-xs text-slate-500">
                        {ProjectCategoryLabels[project.category as ProjectCategory]}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-[#E8A87C] transition-colors" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users size={14} />
                        意向数
                      </span>
                      <span className="text-white font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {project.intentCount} 人
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Target size={14} />
                        转化率
                      </span>
                      <span
                        className={`font-semibold ${
                          project.conversionRate > 50
                            ? 'text-emerald-400'
                            : project.conversionRate > 30
                            ? 'text-blue-400'
                            : 'text-slate-400'
                        }`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {formatPercent(project.conversionRate)}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${getConversionRateBg(project.conversionRate)} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${getConversionRateColor(project.conversionRate)} transition-all duration-700`}
                        style={{ width: `${project.conversionRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign size={14} />
                        客单价
                      </span>
                      <span className="text-[#E8A87C] font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatCurrency(project.avgPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectHot;
