import React, { useState, useEffect } from 'react';
import {
  Building2,
  Stethoscope,
  Users,
  Clock,
  RefreshCw,
  Bell,
  Settings,
  Search,
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore';
import dayjs from 'dayjs';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { headerStats } = useDataStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: '门店总数', value: headerStats.totalStores, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '在线医生', value: headerStats.onlineDoctors, icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: '在线咨询师', value: headerStats.onlineConsultants, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: '今日已接诊', value: headerStats.completedConsultations, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索门店、顾客、项目..."
              className="w-64 h-9 pl-10 pr-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="h-8 w-px bg-slate-700/50" />

        <div className="flex items-center gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={16} className={stat.color} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                  <p className={`text-sm font-bold ${stat.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-slate-300 text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {currentTime.format('YYYY-MM-DD dddd')}
          </p>
          <p className="text-blue-400 text-lg font-bold tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {currentTime.format('HH:mm:ss')}
          </p>
        </div>

        <div className="h-8 w-px bg-slate-700/50" />

        <button className="relative w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all group">
          <RefreshCw size={18} className="group-hover:animate-spin" />
        </button>

        <button className="relative w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            6
          </span>
        </button>

        <button className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
