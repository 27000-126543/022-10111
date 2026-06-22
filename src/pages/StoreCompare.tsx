import React, { useState, useMemo } from 'react';
import {
  Building2,
  Download,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { stores, dataCompletenessIssues } from '../mock/stores';
import { storeRankingData } from '../mock/reports';
import { exportStoreRanking } from '../utils/export';
import { getRankBadgeColor } from '../utils/format';
import BarChart from '../components/charts/BarChart';

type SortField = 'newCustomers' | 'conversionRate' | 'avgWaitTime' | 'dataCompleteness';
type SortOrder = 'asc' | 'desc';

interface RankingItem {
  rank: number;
  name: string;
  newCustomers: number;
  conversionRate: number;
  avgWaitTime: number;
  dataCompleteness: number;
  score: number;
}

interface CompletenessIssue {
  storeName: string;
  missingFields: string[];
  missingCount: number;
}

const RingProgress: React.FC<{ value: number; size?: number; strokeWidth?: number }> = ({
  value,
  size = 120,
  strokeWidth = 12,
}) => {
  const getColor = (val: number) => {
    if (val >= 95) return '#00B42A';
    if (val >= 90) return '#165DFF';
    if (val >= 85) return '#FF7D00';
    return '#F53F3F';
  };

  const color = getColor(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {value.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-400">完整率</span>
      </div>
    </div>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => (
  <span
    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-sm font-bold ${getRankBadgeColor(rank)} shadow-lg`}
  >
    {rank}
  </span>
);

const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  currentField: SortField;
  order: SortOrder;
  onSort: (field: SortField) => void;
}> = ({ label, field, currentField, order, onSort }) => {
  const isActive = currentField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-700/50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          order === 'asc' ? (
            <ChevronUp size={14} className="text-blue-400" />
          ) : (
            <ChevronDown size={14} className="text-blue-400" />
          )
        ) : (
          <div className="w-3.5 h-3.5" />
        )}
      </div>
    </th>
  );
};

const StoreCompare: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('newCustomers');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedRankingData = useMemo(() => {
    const sorted = [...storeRankingData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [sortField, sortOrder]);

  const handleExport = () => {
    exportStoreRanking(storeRankingData, `门店排名_${new Date().toISOString().slice(0, 10)}`);
  };

  const doctorBarChartData = useMemo(
    () => ({
      xData: stores.map((s) => s.name.replace(/店$/, '')),
      yData: [
        {
          name: '待接诊人数',
          data: stores.map((s) => s.doctorBacklog),
          color: '#165DFF',
        },
        {
          name: '平均接诊时长(分钟)',
          data: stores.map((s) => s.avgWaitTime),
          color: '#00B42A',
        },
      ],
    }),
    []
  );

  const getCompletenessColor = (rate: number) => {
    if (rate >= 95) return 'text-emerald-400';
    if (rate >= 90) return 'text-blue-400';
    if (rate >= 85) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getCompletenessBg = (rate: number) => {
    if (rate >= 95) return 'bg-emerald-500/10 border-emerald-500/30';
    if (rate >= 90) return 'bg-blue-500/10 border-blue-500/30';
    if (rate >= 85) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="text-blue-400" />
            门店对比分析
          </h1>
          <p className="text-slate-400 text-sm mt-1">多维度对比各门店运营表现与服务质量</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <option value="newCustomers">按初诊量排序</option>
              <option value="conversionRate">按转化率排序</option>
              <option value="avgWaitTime">按等待时长排序</option>
              <option value="dataCompleteness">按资料完整率排序</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            <Download size={16} />
            导出Excel
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            门店综合排名
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Users size={14} />
              共 {storeRankingData.length} 家门店
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  排名
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  门店名称
                </th>
                <SortableHeader
                  label="初诊量"
                  field="newCustomers"
                  currentField={sortField}
                  order={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="转化率"
                  field="conversionRate"
                  currentField={sortField}
                  order={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="平均等待"
                  field="avgWaitTime"
                  currentField={sortField}
                  order={sortOrder}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="资料完整率"
                  field="dataCompleteness"
                  currentField={sortField}
                  order={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  综合评分
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRankingData.map((item, index) => (
                <tr
                  key={item.name}
                  className={`${index % 2 === 1 ? 'bg-slate-800/30' : ''} hover:bg-slate-700/30 transition-colors`}
                >
                  <td className="px-4 py-4">
                    <RankBadge rank={item.rank} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-white font-medium">{item.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-white font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.newCustomers}
                    </span>
                    <span className="text-slate-500 text-sm ml-1">人</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-semibold ${getCompletenessColor(item.conversionRate * 2)}`}>
                      {item.conversionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-semibold ${item.avgWaitTime <= 15 ? 'text-emerald-400' : item.avgWaitTime <= 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {item.avgWaitTime}分钟
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.dataCompleteness >= 95
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                              : item.dataCompleteness >= 90
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                              : item.dataCompleteness >= 85
                              ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                              : 'bg-gradient-to-r from-rose-400 to-rose-600'
                          }`}
                          style={{ width: `${item.dataCompleteness}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-sm ${getCompletenessColor(item.dataCompleteness)}`}>
                        {item.dataCompleteness}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-white font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.score.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              录入完整性分析
            </h3>
            <span className="text-xs text-slate-400">共 {stores.length} 家门店</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {stores.slice(0, 4).map((store) => (
              <div
                key={store.id}
                className={`flex flex-col items-center p-4 rounded-xl border ${getCompletenessBg(store.dataCompleteness)} transition-all hover:scale-105`}
              >
                <RingProgress value={store.dataCompleteness} size={80} strokeWidth={10} />
                <span className="text-slate-300 text-sm font-medium mt-3 text-center">{store.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              缺失项提醒
            </h4>
            {dataCompletenessIssues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
              >
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                  {issue.missingCount}项
                </span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{issue.storeName}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {issue.missingFields.map((field, i) => (
                      <span key={i} className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-400" />
              医生积压对比
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">待接诊</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">接诊时长</span>
              </div>
            </div>
          </div>
          <BarChart xData={doctorBarChartData.xData} yData={doctorBarChartData.yData} height={280} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stores.slice(0, 4).map((store) => (
              <div key={store.id} className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-slate-400 text-xs">{store.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Users size={14} className="text-blue-400" />
                  <span className="text-white font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {store.doctorBacklog}
                  </span>
                  <span className="text-slate-500 text-xs">人积压</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={14} className="text-emerald-400" />
                  <span className="text-slate-300 text-sm">{store.avgWaitTime}分钟</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCompare;
