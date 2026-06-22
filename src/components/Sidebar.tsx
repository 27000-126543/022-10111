import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Flame,
  AlertTriangle,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const menuItems = [
  { path: '/overview', label: '总览大屏', icon: LayoutDashboard, badge: null },
  { path: '/store-compare', label: '门店对比', icon: Building2, badge: null },
  { path: '/doctor', label: '医生承接', icon: Stethoscope, badge: null },
  { path: '/project', label: '项目热度', icon: Flame, badge: null },
  { path: '/warning', label: '异常预警', icon: AlertTriangle, badge: 6 },
  { path: '/report', label: '复盘报表', icon: FileBarChart, badge: null },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/overview' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <div
      className={`relative h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="text-white" size={20} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">医美分诊</h1>
              <p className="text-slate-500 text-xs">数据驾驶舱</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full shadow-lg shadow-blue-500/50" />
              )}
              
              <Icon size={20} className={active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
              
              {!collapsed && (
                <span className="font-medium text-sm flex-1">
                  {item.label}
                </span>
              )}
              
              {item.badge && !collapsed && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold bg-rose-500 text-white rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
              
              {item.badge && collapsed && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {!collapsed && (
        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                运
              </div>
              <div>
                <p className="text-white text-sm font-medium">运营经理</p>
                <p className="text-slate-500 text-xs">管理员权限</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>实时数据同步中</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
