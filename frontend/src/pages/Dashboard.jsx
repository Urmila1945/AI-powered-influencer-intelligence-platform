import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, TrendingUp, Target, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../services/api';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 8000 },
];

const barData = [
  { name: 'Tech', value: 85 },
  { name: 'Gaming', value: 92 },
  { name: 'Lifestyle', value: 78 },
  { name: 'Fashion', value: 65 },
  { name: 'Finance', value: 88 },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card flex items-center justify-between"
  >
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className={`text-sm mt-2 font-medium ${change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
        {change} vs last month
      </p>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [topCreators, setTopCreators] = useState([]);

  useEffect(() => {
    api.get('/influencer/leaderboard')
      .then(res => setTopCreators(res.data.slice(0, 4)))
      .catch(err => console.error("Failed to load top creators", err));
  }, []);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-gray-400">Track macro trends across the influencer ecosystem.</p>
        </div>
        <Link to="/analysis" className="btn-primary flex items-center gap-2">
          <Zap size={18} /> Analyze Influencer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Influencers" value="142,394" change="+12.5%" icon={Users} color="bg-primary" />
        <StatCard title="Average AQI Score" value="84.2" change="+2.1%" icon={Activity} color="bg-secondary" />
        <StatCard title="High Growth Creators" value="3,291" change="+18.4%" icon={TrendingUp} color="bg-success" />
        <StatCard title="Campaign Success Rate" value="92.8%" change="+5.4%" icon={Target} color="bg-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-lg font-semibold mb-6">Engagement Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-6">Top Niches by AQI</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#06B6D4" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-6">Rising Creators</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="pb-4 font-medium">Creator</th>
                <th className="pb-4 font-medium">Platform</th>
                <th className="pb-4 font-medium">Followers</th>
                <th className="pb-4 font-medium">AQI Score</th>
                <th className="pb-4 font-medium">Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((item, index) => (
                <tr key={item.username || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
                      {item.username?.replace('@', '').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{item.username?.replace('@', '')}</p>
                      <p className="text-xs text-gray-400">{item.username}</p>
                    </div>
                  </td>
                  <td className="py-4">{item.platform}</td>
                  <td className="py-4">{item.followers >= 1000000 ? (item.followers/1000000).toFixed(1) + 'M' : (item.followers/1000).toFixed(1) + 'K'}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-success/20 text-success rounded-md text-xs font-medium border border-success/30">
                      {item.viralmind_score}
                    </span>
                  </td>
                  <td className="py-4 text-success">+{item.growth_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
