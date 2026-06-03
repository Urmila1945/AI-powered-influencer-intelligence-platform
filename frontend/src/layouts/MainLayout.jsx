import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Users, Target, Award, Brain, TrendingUp, Search, Copy, Download, Settings as SettingsIcon, ShieldAlert, Activity, Network } from 'lucide-react';

const Sidebar = ({ onHoverChange }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Stock Market', path: '/stock-market', icon: Activity },
    { name: 'Discovery Engine', path: '/discover', icon: Search },
    { name: 'Influencer Analysis', path: '/analysis', icon: BarChart2 },
    { name: 'Network Graph', path: '/network-graph', icon: Network },
    { name: 'Brand Matching', path: '/brand-match', icon: Target },
    { name: 'Compare', path: '/compare', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'AI Insights', path: '/ai-insights', icon: Brain },
    { name: 'Campaign Simulator', path: '/roi-predictor', icon: TrendingUp },
    { name: 'Audience Analysis', path: '/audience-sentiment', icon: ShieldAlert },
    { name: 'Report Generator', path: '/generate-report', icon: Download },
  ];

  return (
    <div 
      className="w-20 hover:w-64 h-screen glass-panel fixed left-0 top-0 border-r border-white/10 flex flex-col z-50 transition-all duration-300 group overflow-x-hidden bg-[#0a0a0a]/95 backdrop-blur-xl"
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
    >
      <div className="p-6 flex items-center gap-3 whitespace-nowrap min-w-[256px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
           <Brain size={18} className="text-white" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            <span className="text-gradient">VIRALMIND</span> AI
          </Link>
          <p className="text-[10px] text-gray-400 mt-1 font-medium truncate">Predict Influence Before It Happens</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-3 py-3 rounded-xl transition-all duration-200 min-w-[200px] ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-6">
                <Icon size={20} className={isActive ? 'text-primary' : ''} />
              </div>
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 overflow-x-hidden">
        <Link 
          to="/settings"
          className="flex items-center space-x-4 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors min-w-[200px]"
        >
          <div className="shrink-0 flex items-center justify-center w-6">
            <SettingsIcon size={20} />
          </div>
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Settings</span>
        </Link>
      </div>
    </div>
  );
};

import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';

  if (isLandingPage || isAuthPage) {
    return <div className="min-h-screen bg-transparent relative overflow-hidden">{children}</div>;
  }

  // Calculate initials
  let initials = 'U';
  if (user?.name) {
    const names = user.name.split(' ');
    initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  } else if (user?.email) {
    initials = user.email.substring(0, 2).toUpperCase();
  }

  return (
    <div className="min-h-screen bg-transparent flex text-white font-sans selection:bg-primary/30">
      <Sidebar onHoverChange={setIsSidebarHovered} />
      <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarHovered ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 glass-panel border-b border-white/10 sticky top-0 z-30 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            {/* Contextual Header items could go here */}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">System Online</span>
            </div>
            
            <div className="flex items-center space-x-3 relative group">
              <div className="flex flex-col text-right hidden md:flex">
                <span className="text-sm font-bold leading-tight">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-400">{user?.email || ''}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary p-[2px] cursor-pointer">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center hover:bg-white/5 transition-colors">
                  <span className="text-sm font-bold">{initials}</span>
                </div>
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-danger hover:bg-white/5 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>

          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
