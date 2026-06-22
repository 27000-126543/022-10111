import React, { useMemo, useState } from 'react';
import {
  Stethoscope,
  Users,
  Clock,
  Star,
  RotateCcw,
  MessageCircle,
  Download,
  TrendingUp,
  BarChart3,
  Award,
  UserCheck,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { doctors, consultants, heatmapData } from '../mock/doctors';
import { exportDoctorReport, exportConsultantReport } from '../utils/export';
import HeatmapChart from '../components/charts/HeatmapChart';
import BarChart from '../components/charts/BarChart';
import type { Doctor, Consultant } from '../types';

type SortField = 'todayReceptions' | 'avgCommunicationTime' | 'referralSuccessRate' | 'conversionCount';
type SortOrder = 'asc' | 'desc';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, size = 16 }) => {
  const displayRating = (rating / 100) * maxRating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(100, (displayRating - index) * 100));
        return (
          <div key={index} className="relative">
            <Star size={size} className="text-slate-600" />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star size={size} className="text-amber-400 fill-amber-400" />
            </div>
          </div>
        );
      })}
      <span className="ml-1.5 text-sm font-medium text-slate-300">{rating.toFixed(1)}%</span>
    </div>
  );
};

const getRankBadge = (rank: number) => {
  const styles: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
    2: { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400/50' },
    3: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-500/50' },
  };
  const style = styles[rank] || { bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50' };
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${style.bg} ${style.text} ${style.border} font-bold text-sm`}>
      {rank}
    </span>
  );
};

const Doctor承接: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('conversionCount');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortedConsultants = useMemo(() => {
    return [...consultants].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (aVal - bVal) * multiplier;
    });
  }, [sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} className="opacity-30" />;
    return sortOrder === 'asc' ? (
      <ChevronUp size={14} className="text-blue-400" />
    ) : (
      <ChevronDown size={14} className="text-blue-400" />
    );
  };

  const handleExportDoctor = () => {
    exportDoctorReport(doctors, `医生接诊报表_${new Date().toISOString().slice(0, 10)}`);
  };

  const handleExportConsultant = () => {
    exportConsultantReport(consultants, `咨询师接待报表_${new Date().toISOString().slice(0, 10)}`);
  };

  const barChartData = useMemo(() => ({
    xData: consultants.map((c) => c.name),
    yData: [
      {
        name: '接待量',
        data: consultants.map((c) => c.todayReceptions),
        color: '#165DFF',
      },
      {
        name: '成交数',
        data: consultants.map((c) => c.conversionCount),
        color: '#00B42A',
      },
    ],
  }), []);

  const getWaitStatusColor = (wait: number) => {
    if (wait >= 6) return 'text-rose-400';
    if (wait >= 3) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getWaitStatusBg = (wait: number) => {
    if (wait >= 6) return 'bg-rose-500/10 border-rose-500/30';
    if (wait >= 3) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">医生与咨询师接诊效率分析</h1>
          <p className="text-slate-400 text-sm mt-1">实时监控接诊效率，优化资源配置</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportDoctor}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 rounded-lg text-sm font-medium transition-all"
          >
            <Download size={16} />
            导出医生报表
          </button>
          <button
            onClick={handleExportConsultant}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 rounded-lg text-sm font-medium transition-all"
          >
            <Download size={16} />
            导出咨询师报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/30">
                <Award size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  咨询师接待榜
                  <TrendingUp size={16} className="text-emerald-400" />
                </h3>
                <p className="text-slate-500 text-xs">点击表头可排序</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
              共 {consultants.length} 位咨询师
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">排名</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">咨询师</th>
                  <th
                    className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('todayReceptions')}
                  >
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      接待量
                      <SortIcon field="todayReceptions" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('avgCommunicationTime')}
                  >
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      平均沟通
                      <SortIcon field="avgCommunicationTime" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('referralSuccessRate')}
                  >
                    <div className="flex items-center gap-1">
                      <UserCheck size={12} />
                      转介成功率
                      <SortIcon field="referralSuccessRate" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('conversionCount')}
                  >
                    <div className="flex items-center gap-1">
                      <BarChart3 size={12} />
                      成交数
                      <SortIcon field="conversionCount" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {sortedConsultants.map((consultant, index) => (
                  <tr
                    key={consultant.id}
                    className="hover:bg-slate-700/20 transition-colors group"
                  >
                    <td className="py-4 px-2">
                      {getRankBadge(index + 1)}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border border-slate-600">
                          <MessageCircle size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{consultant.name}</div>
                          <div className="text-xs text-slate-500">{consultant.storeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-white font-semibold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {consultant.todayReceptions}
                      </span>
                      <span className="text-slate-500 text-xs ml-1">人</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-slate-300 font-medium">
                        {consultant.avgCommunicationTime}
                      </span>
                      <span className="text-slate-500 text-xs ml-1">分钟</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${consultant.referralSuccessRate}%` }}
                          />
                        </div>
                        <span className="text-blue-400 font-medium text-sm">
                          {consultant.referralSuccessRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                        {consultant.conversionCount}
                        <span className="text-xs font-normal">单</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300 mb-4">接待量与成交数对比</h4>
            <BarChart
              xData={barChartData.xData}
              yData={barChartData.yData}
              height={220}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30">
              <BarChart3 size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">接诊分布热力图</h3>
              <p className="text-slate-500 text-xs">按时间段统计接诊密度</p>
            </div>
          </div>
          <HeatmapChart data={heatmapData} height={350} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/10 flex items-center justify-center border border-blue-500/30">
              <Stethoscope size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                初诊承接效率
                <span className="text-xs font-normal text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">今日</span>
              </h3>
              <p className="text-slate-500 text-xs">医生接诊效率综合评估</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              今日接诊
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              等待中
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              满意度
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              复诊率
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="relative group rounded-xl p-0.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(22, 93, 255, 0.3), rgba(124, 58, 237, 0.2), rgba(22, 93, 255, 0.3))',
              }}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(22, 93, 255, 0.4), rgba(124, 58, 237, 0.3))',
                }}
              />
              <div className="relative h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-[10px] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600/50 group-hover:border-blue-500/50 transition-colors">
                      <Stethoscope size={22} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{doctor.name}</h4>
                      <p className="text-xs text-slate-400">{doctor.specialty}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{doctor.storeName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                      <Users size={12} className="text-blue-400" />
                      今日接诊
                    </div>
                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {doctor.todayPatients}
                      <span className="text-sm font-normal text-slate-500 ml-1">人</span>
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 border ${getWaitStatusBg(doctor.waitingPatients)}`}>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                      <Clock size={12} className={getWaitStatusColor(doctor.waitingPatients)} />
                      等待人数
                    </div>
                    <div className={`text-2xl font-bold ${getWaitStatusColor(doctor.waitingPatients)}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {doctor.waitingPatients}
                      <span className="text-sm font-normal text-slate-500 ml-1">人</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock size={12} />
                      平均接诊
                    </div>
                    <span className="text-slate-300 font-medium text-sm">
                      {doctor.avgConsultationTime} 分钟
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Star size={12} />
                      满意度
                    </div>
                    <StarRating rating={doctor.satisfaction} size={14} />
                  </div>

                  <div className="pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <RotateCcw size={12} className="text-purple-400" />
                        复诊率
                      </div>
                      <span className="text-purple-400 font-semibold text-sm">
                        {doctor.returnVisitRate}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-700"
                        style={{ width: `${doctor.returnVisitRate}%` }}
                      />
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

export default Doctor承接;
