import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0 opacity-30" />
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
