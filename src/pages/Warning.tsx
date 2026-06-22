import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
  User,
  MapPin,
  Download,
  CheckCircle,
  PlayCircle,
  Filter,
  Bell,
  AlertOctagon,
  Users,
  Phone,
  Calendar,
} from 'lucide-react';
import { warningStats, reassignmentAbnormal, highRiskCustomers } from '../mock/warnings';
import { useDataStore } from '../store/useDataStore';
import { exportWarningList } from '../utils/export';
import {
  getWarningLevelColor,
  getWarningLevelText,
  getWarningTypeText,
  getStatusColor,
  getStatusText,
  getTimeAgo,
} from '../utils/format';
import type { WarningItem } from '../types';

type TypeFilter = 'all' | 'timeout' | 'missed' | 'late' | 'reassignment';

interface ReassignmentAbnormal {
  id: string;
  name: string;
  storeName: string;
  role: string;
  reassignmentCount: number;
  avgReassignmentTime: number;
}

interface HighRiskCustomer {
  id: string;
  name: string;
  phone: string;
  storeName: string;
  missedCount: number;
  lateCount: number;
  lastVisit: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const Warning: React.FC = () => {
  const { warnings: storeWarnings, updateWarningStatus } = useDataStore();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filteredWarnings = useMemo(() => {
    if (typeFilter === 'all') return storeWarnings;
    return storeWarnings.filter((w) => w.type === typeFilter);
  }, [storeWarnings, typeFilter]);

  const handleExport = () => {
    exportWarningList(storeWarnings, '预警记录');
  };

  const getTypeIcon = (type: WarningItem['type']) => {
    const icons = {
      timeout: <Clock size={16} />,
      missed: <XCircle size={16} />,
      late: <AlertCircle size={16} />,
      reassignment: <RefreshCw size={16} />,
    };
    return icons[type];
  };

  const getStatusGradient = (status: WarningItem['status']) => {
    const gradients = {
      pending: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/30',
      processing: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30',
      resolved: 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/30',
    };
    return gradients[status];
  };

  const getRiskBorderGradient = (level: 'high' | 'medium' | 'low') => {
    const gradients = {
      high: 'border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent',
      medium: 'border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-transparent',
      low: 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent',
    };
    return gradients[level];
  };

  const filterTabs: { key: TypeFilter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '全部', icon: <Filter size={14} /> },
    { key: 'timeout', label: '超时未接诊', icon: <Clock size={14} /> },
    { key: 'missed', label: '顾客爽约', icon: <XCircle size={14} /> },
    { key: 'late', label: '顾客迟到', icon: <AlertCircle size={14} /> },
    { key: 'reassignment', label: '分诊改派', icon: <RefreshCw size={14} /> },
  ];

  const statCards = [
    { title: '预警总数', value: warningStats.total, icon: <Bell size={20} />, color: '#165DFF', bg: 'from-blue-500/20 to-blue-600/10' },
    { title: '待处理', value: warningStats.pending, icon: <AlertTriangle size={20} />, color: '#F53F3F', bg: 'from-red-500/20 to-red-600/10' },
    { title: '处理中', value: warningStats.processing, icon: <PlayCircle size={20} />, color: '#FF7D00', bg: 'from-orange-500/20 to-orange-600/10' },
    { title: '已解决', value: warningStats.resolved, icon: <CheckCircle size={20} />, color: '#00B42A', bg: 'from-green-500/20 to-green-600/10' },
    { title: '高风险', value: warningStats.highLevel, icon: <AlertOctagon size={20} />, color: '#F53F3F', bg: 'from-red-600/20 to-red-700/10' },
    { title: '中风险', value: warningStats.mediumLevel, icon: <AlertTriangle size={20} />, color: '#FF7D00', bg: 'from-orange-600/20 to-orange-700/10' },
    { title: '低风险', value: warningStats.lowLevel, icon: <AlertCircle size={20} />, color: '#F7BA1E', bg: 'from-yellow-500/20 to-yellow-600/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">预警监控中心</h1>
          <p className="text-slate-400 text-sm mt-1">超时未接诊预警、爽约迟到标记、分诊改派异常监控</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          <Download size={16} />
          导出预警记录
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 transition-all hover:scale-[1.02] hover:border-slate-600/50`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <span className="text-slate-400 text-xs font-medium">{stat.title}</span>
            </div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  typeFilter === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredWarnings.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p>暂无预警记录</p>
              </div>
            ) : (
              filteredWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 transition-all hover:scale-[1.01] hover:border-slate-600/50 ${
                    warning.level === 'high' ? 'ring-1 ring-red-500/30' : ''
                  }`}
                >
                  {warning.level === 'high' && warning.status === 'pending' && (
                    <div className="absolute inset-0 rounded-xl animate-pulse pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(245, 63, 63, 0.15)' }} />
                  )}
                  
                  <div className="relative flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: getWarningLevelColor(warning.level) + '20' }}
                      >
                        <span style={{ color: getWarningLevelColor(warning.level) }}>{getTypeIcon(warning.type)}</span>
                      </div>
                      {warning.level === 'high' && warning.status === 'pending' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-ping" />
                      )}
                      {warning.level === 'high' && warning.status === 'pending' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getWarningLevelColor(warning.level) + '20',
                            color: getWarningLevelColor(warning.level),
                          }}
                        >
                          {getWarningLevelText(warning.level)}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getStatusColor(warning.status) + '15',
                            color: getStatusColor(warning.status),
                          }}
                        >
                          {getWarningTypeText(warning.type)}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusGradient(warning.status)}`}>
                          {getStatusText(warning.status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">{warning.customerName}</span>
                        <span className="text-slate-500">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={12} />
                          {warning.storeName}
                        </span>
                      </div>

                      <p className="text-slate-300 text-sm mb-3">{warning.content}</p>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {getTimeAgo(warning.triggerTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {warning.handler || '未分配'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {warning.status === 'pending' && (
                            <button
                              onClick={() => updateWarningStatus(warning.id, 'processing')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-orange-500/20"
                            >
                              <PlayCircle size={14} />
                              处理
                            </button>
                          )}
                          {warning.status === 'processing' && (
                            <button
                              onClick={() => updateWarningStatus(warning.id, 'resolved')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-medium rounded-lg transition-all shadow-lg shadow-green-500/20"
                            >
                              <CheckCircle size={14} />
                              解决
                            </button>
                          )}
                          {warning.status === 'resolved' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs font-medium rounded-lg">
                              <CheckCircle size={14} />
                              已完成
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <RefreshCw size={16} className="text-orange-400" />
              </div>
              <h3 className="text-white font-semibold">分诊改派异常监控</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 px-2 text-slate-400 font-medium text-xs">人员</th>
                    <th className="text-left py-2 px-2 text-slate-400 font-medium text-xs">角色</th>
                    <th className="text-center py-2 px-2 text-slate-400 font-medium text-xs">改派次数</th>
                    <th className="text-center py-2 px-2 text-slate-400 font-medium text-xs">平均时长</th>
                  </tr>
                </thead>
                <tbody>
                  {reassignmentAbnormal.map((item: ReassignmentAbnormal) => (
                    <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                            <User size={14} className="text-slate-300" />
                          </div>
                          <div>
                            <div className="text-white font-medium text-xs">{item.name}</div>
                            <div className="text-slate-500 text-xs flex items-center gap-1">
                              <MapPin size={10} />
                              {item.storeName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          {item.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-red-400 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.reassignmentCount}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="text-slate-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.avgReassignmentTime}分钟
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <Users size={16} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold">高风险顾客列表</h3>
            </div>

            <div className="space-y-3">
              {highRiskCustomers.map((customer: HighRiskCustomer) => (
                <div
                  key={customer.id}
                  className={`relative rounded-xl border-2 ${getRiskBorderGradient(customer.riskLevel)} p-4 transition-all hover:scale-[1.02]`}
                >
                  {customer.riskLevel === 'high' && (
                    <div className="absolute inset-0 rounded-xl animate-pulse pointer-events-none" style={{ boxShadow: 'inset 0 0 15px rgba(245, 63, 63, 0.2)' }} />
                  )}
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                          <User size={16} className="text-slate-300" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{customer.name}</div>
                          <div className="text-slate-500 text-xs flex items-center gap-1">
                            <Phone size={10} />
                            {customer.phone}
                          </div>
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getWarningLevelColor(customer.riskLevel) + '20',
                          color: getWarningLevelColor(customer.riskLevel),
                        }}
                      >
                        {getWarningLevelText(customer.riskLevel)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                      <MapPin size={10} />
                      {customer.storeName}
                      <span className="mx-1">·</span>
                      <Calendar size={10} />
                      最后就诊: {customer.lastVisit}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <div className="text-red-400 font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {customer.missedCount}
                        </div>
                        <div className="text-slate-500 text-xs">爽约次数</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                        <div className="text-orange-400 font-bold text-lg" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {customer.lateCount}
                        </div>
                        <div className="text-slate-500 text-xs">迟到次数</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warning;
