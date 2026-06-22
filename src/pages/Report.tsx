import React, { useMemo, useState } from 'react';
import { Select, Button, Dropdown, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import {
  FileBarChart,
  Filter,
  Clock,
  ArrowRight,
  Users,
  Stethoscope,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Star,
  Download,
  BarChart3,
  Activity,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import { ProjectCategoryLabels, type ProjectCategory, type ScriptData, type ScheduleSuggestion, type NodeTimeData } from '../types';
import { scriptData, scheduleSuggestions, storeRankingData } from '../mock/reports';
import { exportStoreRanking, exportDoctorReport, exportConsultantReport } from '../utils/export';
import { getRankBadgeColor, formatPercent, formatTime } from '../utils/format';
import FunnelChart from '../components/charts/FunnelChart';
import BarChart from '../components/charts/BarChart';

interface StoreRankingItem {
  rank: number;
  name: string;
  newCustomers: number;
  conversionRate: number;
  avgWaitTime: number;
  dataCompleteness: number;
  score: number;
}

const Report: React.FC = () => {
  const { selectedProjectCategory, setSelectedProjectCategory, getFunnelDataByCategory, getNodeTimeDataByCategory, doctors, consultants, compareCategoryA, compareCategoryB, setCompareCategoryA, setCompareCategoryB, getFunnelDataForCategory, getNodeTimeDataForCategory } = useDataStore();
  const [storeRankingSortField, setStoreRankingSortField] = useState<string>('score');
  const [storeRankingSortOrder, setStoreRankingSortOrder] = useState<'ascend' | 'descend'>('descend');

  const categoryOptions = useMemo(
    () =>
      Object.entries(ProjectCategoryLabels).map(([value, label]) => ({
        value: value as ProjectCategory,
        label,
      })),
    []
  );

  const compareOptions = useMemo(
    () =>
      Object.entries(ProjectCategoryLabels)
        .filter(([key]) => key !== 'all')
        .map(([value, label]) => ({ value: value as ProjectCategory, label })),
    []
  );

  const funnelData = useMemo(() => getFunnelDataByCategory(), [selectedProjectCategory, getFunnelDataByCategory]);
  const nodeTimeData = useMemo(() => getNodeTimeDataByCategory(), [selectedProjectCategory, getNodeTimeDataByCategory]);

  const bestScript = useMemo(() => {
    return scriptData.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    , scriptData[0]);
  }, []);

  const nodeTimeChartData = useMemo(() => ({
    xData: nodeTimeData.map((d: NodeTimeData) => d.node),
    yData: [
      {
        name: '平均耗时',
        data: nodeTimeData.map((d: NodeTimeData) => d.avgTime),
        color: '#722ED1',
      },
    ],
  }), [nodeTimeData]);

  const compareFunnelA = useMemo(() => getFunnelDataForCategory(compareCategoryA), [compareCategoryA, getFunnelDataForCategory]);
  const compareFunnelB = useMemo(() => getFunnelDataForCategory(compareCategoryB), [compareCategoryB, getFunnelDataForCategory]);
  const compareNodeTimeA = useMemo(() => getNodeTimeDataForCategory(compareCategoryA), [compareCategoryA, getNodeTimeDataForCategory]);
  const compareNodeTimeB = useMemo(() => getNodeTimeDataForCategory(compareCategoryB), [compareCategoryB, getNodeTimeDataForCategory]);

  const compareDiffData = useMemo(() => {
    const mapB = new Map(compareNodeTimeB.map((d: NodeTimeData) => [d.node, d.avgTime]));
    return compareNodeTimeA.map((d: NodeTimeData) => {
      const timeB = mapB.get(d.node) ?? 0;
      const diff = d.avgTime - timeB;
      return { node: d.node, timeA: d.avgTime, timeB, diff };
    });
  }, [compareNodeTimeA, compareNodeTimeB]);

  const getComparisonColor = (comparison: number): string => {
    return comparison > 0 ? 'text-rose-400' : 'text-emerald-400';
  };

  const getComparisonIcon = (comparison: number) => {
    return comparison > 0 
      ? <ChevronUp size={14} className="text-rose-400" />
      : <ChevronDown size={14} className="text-emerald-400" />;
  };

  const sortedStoreRankingData = useMemo(() => {
    const sorted = [...storeRankingData].sort((a, b) => {
      const aVal = a[storeRankingSortField as keyof StoreRankingItem] as number;
      const bVal = b[storeRankingSortField as keyof StoreRankingItem] as number;
      return storeRankingSortOrder === 'ascend' ? aVal - bVal : bVal - aVal;
    });
    return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [storeRankingSortField, storeRankingSortOrder]);

  const handleTableChange: TableProps<StoreRankingItem>['onChange'] = (_pagination, _filters, sorter) => {
    if (sorter && !Array.isArray(sorter) && sorter.field && sorter.order) {
      setStoreRankingSortField(sorter.field as string);
      setStoreRankingSortOrder(sorter.order);
    }
  };

  const exportMenuItems = [
    {
      key: 'store',
      label: '导出门店排名',
      icon: <Download size={14} />,
      onClick: () => exportStoreRanking(sortedStoreRankingData, `门店排名_${new Date().toLocaleDateString('zh-CN')}`),
    },
    {
      key: 'doctor',
      label: '导出医生报表',
      icon: <Stethoscope size={14} />,
      onClick: () => exportDoctorReport(doctors, `医生报表_${new Date().toLocaleDateString('zh-CN')}`),
    },
    {
      key: 'consultant',
      label: '导出咨询师报表',
      icon: <Users size={14} />,
      onClick: () => exportConsultantReport(consultants, `咨询师报表_${new Date().toLocaleDateString('zh-CN')}`),
    },
  ];

  const scriptColumns: TableProps<ScriptData>['columns'] = [
    {
      title: '话术名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: ScriptData) => (
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#722ED1]" />
          <span className="text-white font-medium">{text}</span>
          {record.conversionRate === bestScript.conversionRate && (
            <Tag color="gold" className="ml-2">
              <Star size={12} className="inline mr-1" />
              最优推荐
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 120,
      align: 'center',
      render: (count: number) => (
        <span className="text-white font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {count} <span className="text-slate-400 font-normal text-sm">次</span>
        </span>
      ),
      sorter: (a: ScriptData, b: ScriptData) => a.usageCount - b.usageCount,
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 180,
      render: (rate: number, record: ScriptData) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                record.conversionRate === bestScript.conversionRate
                  ? 'bg-gradient-to-r from-[#722ED1] to-[#165DFF]'
                  : 'bg-gradient-to-r from-slate-500 to-slate-400'
              }`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <span
            className={`font-semibold w-16 text-right ${
              record.conversionRate === bestScript.conversionRate ? 'text-[#722ED1]' : 'text-slate-300'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formatPercent(rate)}
          </span>
        </div>
      ),
      sorter: (a: ScriptData, b: ScriptData) => a.conversionRate - b.conversionRate,
      defaultSortOrder: 'descend',
    },
    {
      title: '平均沟通时长',
      dataIndex: 'avgTalkTime',
      key: 'avgTalkTime',
      width: 140,
      align: 'center',
      render: (time: number) => (
        <span className="text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <Clock size={14} className="inline mr-1 text-slate-500" />
          {time} <span className="text-slate-400 text-sm">分钟</span>
        </span>
      ),
      sorter: (a: ScriptData, b: ScriptData) => a.avgTalkTime - b.avgTalkTime,
    },
    {
      title: '效果评估',
      key: 'evaluation',
      width: 120,
      align: 'center',
      render: (_: unknown, record: ScriptData) => {
        const efficiency = (record.conversionRate / record.avgTalkTime) * 100;
        if (efficiency > 2.5) {
          return (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
              <CheckCircle size={14} /> 优秀
            </span>
          );
        }
        if (efficiency > 1.5) {
          return (
            <span className="inline-flex items-center gap-1 text-blue-400 text-sm">
              <Activity size={14} /> 良好
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-slate-400 text-sm">
            <AlertCircle size={14} /> 待优化
          </span>
        );
      },
    },
  ];

  const storeRankingColumns: TableProps<StoreRankingItem>['columns'] = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (rank: number) => (
        <div className={`w-8 h-8 rounded-full ${getRankBadgeColor(rank)} flex items-center justify-center text-white font-bold text-sm mx-auto`}>
          {rank <= 3 ? <Award size={14} /> : rank}
        </div>
      ),
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      render: (text: string) => (
        <span className="text-white font-medium">{text}</span>
      ),
    },
    {
      title: '今日初诊量',
      dataIndex: 'newCustomers',
      key: 'newCustomers',
      width: 120,
      align: 'center',
      render: (count: number) => (
        <span className="text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {count} <span className="text-slate-400 text-sm">人</span>
        </span>
      ),
      sorter: (a, b) => a.newCustomers - b.newCustomers,
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 140,
      align: 'center',
      render: (rate: number) => (
        <span className={rate > 35 ? 'text-emerald-400' : 'text-slate-300'} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {formatPercent(rate)}
        </span>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
    {
      title: '平均等待',
      dataIndex: 'avgWaitTime',
      key: 'avgWaitTime',
      width: 120,
      align: 'center',
      render: (time: number) => (
        <span className={time < 20 ? 'text-emerald-400' : time < 25 ? 'text-amber-400' : 'text-rose-400'} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {time} <span className="text-slate-400 text-sm">分钟</span>
        </span>
      ),
      sorter: (a, b) => a.avgWaitTime - b.avgWaitTime,
    },
    {
      title: '资料完整率',
      dataIndex: 'dataCompleteness',
      key: 'dataCompleteness',
      width: 140,
      align: 'center',
      render: (rate: number) => (
        <span className={rate > 95 ? 'text-emerald-400' : 'text-slate-300'} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {formatPercent(rate)}
        </span>
      ),
      sorter: (a, b) => a.dataCompleteness - b.dataCompleteness,
    },
    {
      title: '综合评分',
      dataIndex: 'score',
      key: 'score',
      width: 180,
      render: (score: number) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                background: `linear-gradient(90deg, #165DFF 0%, #722ED1 50%, #00B42A 100%)`,
                width: `${score}%`,
              }}
            />
          </div>
          <span className="text-white font-bold w-12 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {score.toFixed(1)}
          </span>
        </div>
      ),
      sorter: (a, b) => a.score - b.score,
      defaultSortOrder: 'descend',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="text-[#722ED1]" size={24} />
            运营分析报表
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            节点耗时、排班优化、导诊话术多维度数据分析
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
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button
              type="primary"
              icon={<Download size={16} />}
              className="!bg-gradient-to-r !from-[#722ED1] !to-[#165DFF] !border-none"
            >
              导出报表
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Clock size={18} className="text-[#722ED1]" />
              节点耗时分析
            </h3>
            <span className="text-xs text-slate-400">
              各环节平均耗时（分钟）
            </span>
          </div>
          <BarChart
            xData={nodeTimeChartData.xData}
            yData={nodeTimeChartData.yData}
            height={280}
            horizontal
          />
          <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-700/50">
            {nodeTimeData.map((node: NodeTimeData) => (
              <div key={node.node} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {getComparisonIcon(node.comparison)}
                  <span
                    className={`text-xs font-semibold ${getComparisonColor(node.comparison)}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {node.comparison > 0 ? '+' : ''}{node.comparison.toFixed(1)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">较昨日</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-[#165DFF]" />
              成交路径漏斗
            </h3>
            <span className="text-xs text-slate-400">
              当前: {ProjectCategoryLabels[selectedProjectCategory]}
            </span>
          </div>
          <FunnelChart data={funnelData} height={320} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#722ED1]" />
              成交路径对比
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              选择两个项目分类并排对比漏斗与节点耗时差异
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={compareCategoryA}
              onChange={setCompareCategoryA}
              options={compareOptions}
              className="w-40"
              size="small"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              popupClassName="!bg-slate-800 !border-slate-700"
            />
            <span className="text-slate-500 text-sm">VS</span>
            <Select
              value={compareCategoryB}
              onChange={setCompareCategoryB}
              options={compareOptions}
              className="w-40"
              size="small"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              popupClassName="!bg-slate-800 !border-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#722ED1]" />
              {ProjectCategoryLabels[compareCategoryA]}
            </h4>
            <FunnelChart data={compareFunnelA} height={280} />
          </div>
          <div>
            <h4 className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#165DFF]" />
              {ProjectCategoryLabels[compareCategoryB]}
            </h4>
            <FunnelChart data={compareFunnelB} height={280} />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-lg p-4">
          <h4 className="text-slate-300 text-sm font-medium mb-3">节点耗时差异对比</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700/50">
                <th className="text-left py-2 font-medium">环节</th>
                <th className="text-right py-2 font-medium">{ProjectCategoryLabels[compareCategoryA]}耗时</th>
                <th className="text-right py-2 font-medium">{ProjectCategoryLabels[compareCategoryB]}耗时</th>
                <th className="text-right py-2 font-medium">差异值</th>
              </tr>
            </thead>
            <tbody>
              {compareDiffData.map((row) => (
                <tr key={row.node} className="border-b border-slate-700/30 last:border-0">
                  <td className="py-2.5 text-white">{row.node}</td>
                  <td className="py-2.5 text-right text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.timeA.toFixed(1)} <span className="text-slate-500 text-xs">分钟</span>
                  </td>
                  <td className="py-2.5 text-right text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {row.timeB.toFixed(1)} <span className="text-slate-500 text-xs">分钟</span>
                  </td>
                  <td
                    className={`py-2.5 text-right ${Math.abs(row.diff) > 5 ? 'font-bold' : ''} ${
                      row.diff > 0 ? 'text-rose-400' : row.diff < 0 ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {row.diff > 0 ? '+' : ''}{row.diff.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Calendar size={18} className="text-[#00B42A]" />
              排班优化建议
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              基于历史客流数据的智能排班推荐
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-xs text-amber-400">智能推荐</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {scheduleSuggestions.map((suggestion: ScheduleSuggestion, index: number) => (
            <div
              key={`${suggestion.timeSlot}-${suggestion.dayOfWeek}`}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#722ED1]/20 via-[#165DFF]/20 to-[#00B42A]/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 group-hover:border-[#722ED1]/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      {suggestion.timeSlot}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {suggestion.dayOfWeek}
                    </div>
                  </div>
                  {index < 2 && (
                    <Tag color="red" className="!text-[10px] !px-1.5 !py-0">
                      高峰时段
                    </Tag>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Stethoscope size={14} className="text-[#165DFF]" />
                      建议医生
                    </span>
                    <span className="text-white font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {suggestion.suggestedDoctors} <span className="text-slate-500 text-xs">人</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users size={14} className="text-[#722ED1]" />
                      建议咨询师
                    </span>
                    <span className="text-white font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {suggestion.suggestedConsultants} <span className="text-slate-500 text-xs">人</span>
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-500" />
                        预计等待
                      </span>
                      <span
                        className={`font-semibold ${
                          suggestion.avgWaitTime < 20
                            ? 'text-emerald-400'
                            : suggestion.avgWaitTime < 25
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {suggestion.avgWaitTime} <span className="text-slate-500 text-xs">分钟</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageSquare size={18} className="text-[#722ED1]" />
              导诊话术分析
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              不同沟通话术的转化效果对比分析
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#722ED1]/10 px-3 py-1.5 rounded-lg">
            <Star size={14} className="text-amber-400" />
            <span className="text-xs text-slate-300">
              最优话术: <span className="text-[#722ED1] font-semibold">{bestScript.name}</span>
            </span>
          </div>
        </div>

        <Table<ScriptData>
          columns={scriptColumns}
          dataSource={scriptData}
          rowKey="name"
          pagination={false}
          size="middle"
          className="report-script-table"
        />
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              门店综合排名
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              各门店运营指标综合评分排名
            </p>
          </div>
          <Button
            type="primary"
            ghost
            icon={<Download size={16} />}
            onClick={() => exportStoreRanking(sortedStoreRankingData, `门店排名_${new Date().toLocaleDateString('zh-CN')}`)}
            className="!border-[#722ED1] !text-[#722ED1] hover:!bg-[#722ED1]/10"
          >
            导出排名
          </Button>
        </div>

        <Table<StoreRankingItem>
          columns={storeRankingColumns}
          dataSource={sortedStoreRankingData}
          rowKey="name"
          pagination={false}
          size="middle"
          onChange={handleTableChange}
          className="report-ranking-table"
        />
      </div>

      <style>{`
        .report-script-table .ant-table,
        .report-ranking-table .ant-table {
          background: transparent;
        }
        .report-script-table .ant-table-thead > tr > th,
        .report-ranking-table .ant-table-thead > tr > th {
          background: rgba(30, 41, 59, 0.8);
          color: #94A3B8;
          border-bottom: 1px solid rgba(71, 85, 105, 0.5);
          font-weight: 500;
        }
        .report-script-table .ant-table-tbody > tr > td,
        .report-ranking-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(71, 85, 105, 0.3);
          background: transparent;
        }
        .report-script-table .ant-table-tbody > tr:hover > td,
        .report-ranking-table .ant-table-tbody > tr:hover > td {
          background: rgba(114, 46, 209, 0.05) !important;
        }
        .report-script-table .ant-table-column-sorter-up,
        .report-script-table .ant-table-column-sorter-down,
        .report-ranking-table .ant-table-column-sorter-up,
        .report-ranking-table .ant-table-column-sorter-down {
          color: #64748B;
        }
        .report-script-table .ant-table-column-sorter-up.active,
        .report-script-table .ant-table-column-sorter-down.active,
        .report-ranking-table .ant-table-column-sorter-up.active,
        .report-ranking-table .ant-table-column-sorter-down.active {
          color: #722ED1;
        }
      `}</style>
    </div>
  );
};

export default Report;
