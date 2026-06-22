import React, { useMemo, useState } from 'react';
import { Drawer } from 'antd';
import { AlertCircle, Clock, MapPin, User, ChevronRight, Bell, Building2, Users, TrendingUp, TrendingDown, X, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import KpiCard from '../components/KpiCard';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { formatTime, getWarningLevelColor, getWarningTypeText } from '../utils/format';

const Overview: React.FC = () => {
  const {
    kpiData,
    waitingCustomers,
    channelSources,
    trendData7Days,
    trendData30Days,
    selectedTimeRange,
    setSelectedTimeRange,
    stores,
    storeCustomers,
    getStoreCustomers,
  } = useDataStore();

  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const trendData = selectedTimeRange === '7d' ? trendData7Days : trendData30Days;

  const lineChartData = useMemo(
    () => ({
      xData: trendData.map((d) => d.date),
      yData: [
        {
          name: '初诊量',
          data: trendData.map((d) => d.newCustomers),
          color: '#165DFF',
          yAxisIndex: 0,
        },
        {
          name: '转化率',
          data: trendData.map((d) => d.conversionRate),
          color: '#00B42A',
          yAxisIndex: 1,
        },
      ],
    }),
    [trendData]
  );

  const getStatusStyles = (status: string) => {
    const styles: Record<string, { bg: string; border: string; pulse: string; text: string }> = {
      danger: {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/50',
        pulse: 'bg-rose-500',
        text: '超时严重',
      },
      warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/50',
        pulse: 'bg-amber-500',
        text: '等待超时',
      },
      normal: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/50',
        pulse: 'bg-emerald-500',
        text: '正常等待',
      },
    };
    return styles[status] || styles.normal;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">总览大屏</h1>
          <p className="text-slate-400 text-sm mt-1">实时监控各门店初诊分诊运营数据</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setSelectedTimeRange('7d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedTimeRange === '7d'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              近7天
            </button>
            <button
              onClick={() => setSelectedTimeRange('30d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedTimeRange === '30d'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              近30天
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiData.map((kpi, index) => (
          <KpiCard key={kpi.title} data={kpi} delay={index * 200} />
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Building2 size={18} className="text-blue-400" />
            各门店今日初诊概览
          </h3>
          <span className="text-xs text-slate-400">共 {stores.length} 家门店</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stores.map((store) => {
            const isRedLight = store.avgWaitTime >= 25;
            const isWarning = store.avgWaitTime >= 20 && store.avgWaitTime < 25;
            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store.name)}
                className={`relative rounded-xl p-3 border transition-all hover:scale-105 cursor-pointer ${
                  isRedLight
                    ? 'bg-rose-500/10 border-rose-500/50'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                {isRedLight && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
                {isWarning && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
                <div className="text-slate-400 text-xs font-medium truncate mb-2">{store.name.replace(/店$/, '')}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {store.todayNewCustomers}
                  </span>
                  <span className="text-slate-500 text-xs mb-1">人</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className={isRedLight ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'} />
                  <span className={`text-xs font-medium ${isRedLight ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {store.avgWaitTime}分钟
                  </span>
                </div>
                {isRedLight && (
                  <div className="mt-1.5 text-[10px] text-rose-400 font-medium">等待红灯</div>
                )}
                {isWarning && (
                  <div className="mt-1.5 text-[10px] text-amber-400 font-medium">等待预警</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <AlertCircle size={18} className="text-blue-400" />
              实时等待红灯监控
            </h3>
            <span className="text-xs text-slate-400">共 {waitingCustomers.length} 人等待</span>
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 space-y-3">
            {waitingCustomers.map((customer) => {
              const statusStyles = getStatusStyles(customer.status);
              return (
                <div
                  key={customer.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${statusStyles.bg} ${statusStyles.border} transition-all hover:scale-[1.02] cursor-pointer group`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <User size={18} className="text-slate-300" />
                    </div>
                    <span
                      className={`absolute -top-0 -right-0 w-3 h-3 rounded-full ${statusStyles.pulse} animate-pulse`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{customer.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getWarningLevelColor(customer.status === 'danger' ? 'high' : customer.status === 'warning' ? 'medium' : 'low') + '20', 
                          color: getWarningLevelColor(customer.status === 'danger' ? 'high' : customer.status === 'warning' ? 'medium' : 'low') 
                        }}
                      >
                        {customer.status === 'danger' ? '高风险' : customer.status === 'warning' ? '中风险' : '正常'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={12} />
                        {customer.storeName}
                      </span>
                      <span className="text-xs text-slate-500">|</span>
                      <span className="text-xs text-slate-400">{customer.projectType}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-rose-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {customer.waitTime}
                    </div>
                    <div className="text-xs text-slate-500">分钟</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {customer.signInTime}
                    </div>
                    <span className="text-xs text-slate-500">{customer.consultant}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Bell size={18} className="text-amber-400" />
              渠道来源分布
            </h3>
          </div>
          <PieChart data={channelSources} height={280} showLabel={false} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {channelSources.slice(0, 4).map((channel, index) => {
              const colors = ['#165DFF', '#00B42A', '#FF7D00', '#722ED1'];
              return (
                <div key={channel.name} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index] }} />
                    <span className="text-slate-300 text-xs font-medium">{channel.name}</span>
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-white font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {channel.value}
                    </span>
                    <span className="text-emerald-400 text-xs">{channel.conversionRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">初诊量与转化率趋势</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-400">初诊量</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-400">转化率</span>
            </div>
          </div>
        </div>
        <LineChart
          xData={lineChartData.xData}
          yData={lineChartData.yData}
          showLegend={false}
          height={320}
        />
      </div>

      <Drawer
        open={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        width={520}
        placement="right"
        closeIcon={<X size={18} className="text-slate-400" />}
        styles={{
          content: { background: '#1E293B' },
          header: { background: '#0F172A', borderBottom: '1px solid rgba(71,85,105,0.5)' },
          body: { background: '#1E293B', padding: 0 },
        }}
        title={
          selectedStore ? (
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-blue-400" />
              <span className="text-white font-semibold">{selectedStore}</span>
              <span className="text-slate-400 text-sm font-normal">
                今日初诊 {getStoreCustomers(selectedStore).length} 人
              </span>
            </div>
          ) : null
        }
      >
        {selectedStore && (() => {
          const customers = getStoreCustomers(selectedStore);
          const dangerList = customers.filter((c) => c.status === 'danger');
          const warningList = customers.filter((c) => c.status === 'warning');
          const normalList = customers.filter((c) => c.status === 'normal');

          const groups = [
            { key: 'danger', label: '超时等待', list: dangerList, icon: AlertCircle, color: 'rose' as const, borderColor: 'border-rose-500/50', bgColor: 'bg-rose-500/10', textColor: 'text-rose-400', pulseBorder: 'animate-pulse border-2 border-rose-500' },
            { key: 'warning', label: '等待预警', list: warningList, icon: Clock, color: 'amber' as const, borderColor: 'border-amber-500/50', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', pulseBorder: 'border-2 border-amber-500/70' },
            { key: 'normal', label: '正常等候', list: normalList, icon: CheckCircle2, color: 'emerald' as const, borderColor: 'border-emerald-500/50', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', pulseBorder: 'border-2 border-emerald-500/40' },
          ];

          return (
            <div className="p-4 space-y-5">
              {groups.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <group.icon size={16} className={group.textColor} />
                    <span className={`text-sm font-semibold ${group.textColor}`}>{group.label}</span>
                    <span className="text-xs text-slate-500 ml-1">{group.list.length} 人</span>
                  </div>
                  {group.list.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2 pl-6">暂无</div>
                  ) : (
                    <div className="space-y-2 pl-1">
                      {group.list.map((customer) => (
                        <div
                          key={customer.id}
                          className={`rounded-xl p-4 bg-slate-800/60 ${group.borderColor} ${group.key === 'danger' ? 'animate-pulse' : ''} transition-all`}
                          style={group.key === 'danger' ? { boxShadow: '0 0 12px rgba(244,63,94,0.15)' } : undefined}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                                <User size={14} className="text-slate-300" />
                              </div>
                              <span className="text-white font-medium text-sm">{customer.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${group.bgColor} ${group.textColor}`}>
                                {group.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} className={group.textColor} />
                              <span className={`text-lg font-bold ${group.textColor}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {customer.waitTime}
                              </span>
                              <span className="text-slate-500 text-xs">分钟</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={11} className="text-slate-500" />
                              <span className="text-slate-400">{customer.projectType}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={11} className="text-slate-500" />
                              <span className="text-slate-400">签到 {customer.signInTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <User size={11} className="text-slate-500" />
                              <span className="text-slate-400">{customer.consultant}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ChevronRight size={11} className="text-slate-500" />
                              <span className="text-slate-400">{customer.nextStep}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
};

export default Overview;
